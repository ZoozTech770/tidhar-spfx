import { ISPFXContext, SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import "@pnp/sp/site-users";
import { Web } from "@pnp/sp/webs";
import { IInquiriesItem } from "../interfaces/IInquiriesItem";
import { IFormItem } from "../interfaces/IformItem";
import { translateStatusToHebrew, translateTitleToHebrew } from "../util/inquiriesMappings";

export default class myInquiriesService {
  private createArchiveMyInquiryItem(item: any, createdByMe: boolean) {
    // For archive items we want to show the "other side" of the request:
    // - If I opened the request (createdByMe === true) → show the approver's name
    // - If I approved the request (createdByMe === false) → show the creator's name
    //
    // Legacy items (CAML) have FieldValuesAsText.Author, while HR items (OData)
    // have Author/Title and Editor/Title only.
    const hasFieldValuesAsText = !!item.FieldValuesAsText;

    const creatorName = hasFieldValuesAsText
      ? item.FieldValuesAsText.Author
      : item.Author?.Title;

    const approverName = item.Editor?.Title;

    return {
      title: item.eldFormName,
      date: new Date(item.Created),
      lastModified: new Date(item.Modified),
      createrOrApprover: createdByMe ? approverName : creatorName,
      status: item.eldStatus,
      link: { Url: item.eldFormURL?.Url },
      formHandlingPeriod: 0,
      createdByMe: createdByMe,
      receiverName: item.eldReceiverName,
    };
  }
  private createMyInquiryItem(item: any, formHandlingPeriod: number) {
    const inquiryItem: IInquiriesItem = {
      title: item.eldFormName,
      date: new Date(item.Created),
      lastModified: new Date(item.Modified),
      status: item.eldStatus,
      link: { Url: item.eldFormURL?.Url },
      formHandlingPeriod: formHandlingPeriod,
    };
    return inquiryItem;
  }

  // Normalize raw SharePoint inquiry item so the rest of the service/UI
  // can rely on the legacy field names (eldStatus, Title, etc.).
  private normalizeInquiryItemForUi(listMeta: any, inquiry: any): any {
    // Apply normalization for new HR list (ID === 2) and Internal Mobility (ID === 4)
    if (listMeta.id === 2 || listMeta.id === 4) {
      // Debug logging for Internal Mobility
      if (listMeta.id === 4) {
        console.log('[Internal Mobility Debug] Raw inquiry item:', inquiry);
        console.log('[Internal Mobility Debug] Status field value:', inquiry.Status);
        console.log('[Internal Mobility Debug] eldStatus field value:', inquiry.eldStatus);
      }
      
      // Status -> eldStatus (with translation to Hebrew for new apps)
      // Check for both undefined and null because SharePoint can return null
      if (inquiry.Status !== undefined && (inquiry.eldStatus === undefined || inquiry.eldStatus === null)) {
        const translatedStatus = translateStatusToHebrew(inquiry.Status);
        console.log(`[Status Translation] Original: "${inquiry.Status}" -> Translated: "${translatedStatus}"`);
        inquiry.eldStatus = translatedStatus;
      }

      // RequestType -> eldFormName (this is what the UI uses as the form title)
      // Apply Hebrew translation for form names
      if (inquiry.RequestType !== undefined && inquiry.eldFormName === undefined) {
        inquiry.eldFormName = translateTitleToHebrew(inquiry.RequestType);
      }

      // Optionally also map to Title if it is used elsewhere
      if (inquiry.RequestType !== undefined && inquiry.Title === undefined) {
        inquiry.Title = translateTitleToHebrew(inquiry.RequestType);
      }

      // Build Power Apps URL for this request if not already present.
      if (listMeta.id === 4) {
        // Internal Mobility: use hardcoded Power Apps URL with JobId (from eldJobID) and reqId (from ID)
        if (!inquiry.eldFormURL && (inquiry.ID !== undefined || inquiry.Id !== undefined)) {
          const reqId = inquiry.ID !== undefined ? inquiry.ID : inquiry.Id;
          const jobId = inquiry.eldJobID; // JobId comes from eldJobID column
          const url = `https://apps.powerapps.com/play/e/85b73110-9842-e983-bdbb-d61c175c1c5d/a/cbbbb978-aeb0-42fd-b90f-7b917f7c0afd?tenantId=47339e34-e7be-4166-9485-70ccbd784a21&hint=c84da289-29d1-48d5-9ecb-e8da186e68cc&sourcetime=1767160636074&JobId=${jobId}&reqId=${reqId}`;
          inquiry.eldFormURL = { Url: url };
        }
      } else if (listMeta.id === 2) {
        if (!inquiry.eldFormURL && (inquiry.ID !== undefined || inquiry.Id !== undefined) && listMeta.formLinkUrl) {
          const reqId = inquiry.ID !== undefined ? inquiry.ID : inquiry.Id;
          const baseUrl: string = listMeta.formLinkUrl;
          const separator = baseUrl.includes("?") ? "&" : "?";
          const url = `${baseUrl}${separator}reqId=${reqId}`;
          inquiry.eldFormURL = { Url: url };
        }
      }

      // Add any other field mappings here as needed to match the
      // structure expected by the existing UI/service code.
    }

    return inquiry;
  }

  public async getMyInquiriesItems(
    context: ISPFXContext,
    list: string,
    isArchive?: boolean
  ) {
    let res: IInquiriesItem[] = [];
    let inquiries: IInquiriesItem[] = [];
    const formsLists = await this.getFormsManagementListItems(context, list);
    const tempres = await this.getFormsManagementListItems(context, list);
    const today = new Date();
    const lastWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    ).toISOString();
    let userName;
    let userEmail;
    const sp = spfi().using(SPFx(context));
    const userProps = await sp.web.currentUser();
    userEmail = userProps.Email

    if (isArchive == true) {
      userName = userProps.LoginName;
    }
    for (let i = 0; i < formsLists.length; i++) {
      try {
        if (isArchive == true) {
          inquiries = await this.getArchiveUserRequestsFromList(
            formsLists[i],
            lastWeek,
            context,
            userName
          );
        } else
          inquiries = await this.getCurrentUserRequestsFromList(
            formsLists[i],
            lastWeek,
            context,
            userEmail
          );
        res = res.concat(inquiries);
      } catch (error) { }
    }
    res.sort(function (a: any, b: any) {
      return b.date - a.date;
    });
    return res;
  }


  private async getCurrentUserRequestsFromList(
    item: any,
    date: string,
    context: ISPFXContext,
    userEmail: string
  ) {
    let res: IInquiriesItem[] = [];
    const web = Web(item.webUrl).using(SPFx(context));

    // Build filter per list: old lists use eldStatus, new list (ID === 2) uses Status
    let filterMyInquiries: string;
    if (item.id === 2) {
      // New list schema: Status column and "in process" value
      filterMyInquiries = `((Status eq 'in process') and Modified ge datetime'${date}')`;
    } else if (item.id === 4) {
      // Internal Mobility: check BOTH Status (new app) and eldStatus (old app)
      filterMyInquiries = `(((Status eq 'in process') or (eldStatus eq 'בטיפול') or (eldStatus eq 'טיוטה')) and Modified ge datetime'${date}')`;
    } else {
      // Existing lists schema: eldStatus column and Hebrew status values
      filterMyInquiries = `((eldStatus eq 'בטיפול' or eldStatus eq 'טיוטה') and Modified ge datetime'${date}')`;
    }

    try {
      //debugger
      let items = [];
      try {
        // נבנה את השאילתה בהתאם לסוג הטופס
        let selectFields = "*,Author/UserName,Author/SipAddress,Author/EMail,Author/Name,Author/Title,Editor/Title";
        let expandFields = "Author,Editor";

        if (item.formId == 222) {
          // עבור טופס WOW - נוסיף את השדות המיוחדים
          selectFields += ",eldEmpFullName/Title,eldReceiverName/Title";
          expandFields += ",eldEmpFullName,eldReceiverName";
        }

        items = await web
          .getList(item.listUrl)
          .items.filter(filterMyInquiries)
          .select(selectFields)
          .expand(expandFields)();

      } catch (error) {
        console.error(`Error fetching list at ${item.listUrl}:`, error);
        items = [];
      }


      for (const inquiryRaw of items) {
        try {
          if (inquiryRaw.Author && inquiryRaw.Author.EMail === userEmail) {
            const inquiry = this.normalizeInquiryItemForUi(item, inquiryRaw);
            
            // Debug logging for Internal Mobility after normalization
            if (item.id === 4) {
              console.log('[Internal Mobility Debug] After normalization:', inquiry);
              console.log('[Internal Mobility Debug] eldStatus after normalization:', inquiry.eldStatus);
            }
            
            let inquiryItem = this.createMyInquiryItem(inquiry, item.formHandlingPeriod);
            
            // Debug logging for Internal Mobility final inquiry item
            if (item.id === 4) {
              console.log('[Internal Mobility Debug] Final inquiry item:', inquiryItem);
              console.log('[Internal Mobility Debug] Final status:', inquiryItem.status);
            }
            
            if (item.formId == 222) {
              inquiryItem.receiverName = inquiry?.eldReceiverName?.Title;
            }

            res.push(inquiryItem);
          }
        } catch (innerError) {
          console.error('Error processing inquiry item:', innerError);
        }
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }

    return res;
  }

  private async getArchiveUserRequestsFromList(
    item: any,
    date: string,
    context: ISPFXContext,
    userAccountName: string
  ) {
    let res: IInquiriesItem[] = [];
    const today = new Date();

    // Archive window: TEMPORARILY CHANGED TO 2 WEEKS FOR TESTING (was 2 years)
    // "date" comes from getMyInquiriesItems and is computed as today - 7 days.
    const endDate = date; // upper bound (e.g. lastWeek)
    const pastTwoWeeks = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 14  // 2 weeks ago instead of 2 years
    ).toISOString();

    const web = Web(item.webUrl).using(SPFx(context));

    const queryTreatedByMe = {
      ViewXml: `<View><Query><Where> 
       <Eq>
         <FieldRef Name='eldApprovalHistory'></FieldRef>
         <Value Type='User'><UserID/></Value>
       </Eq> 
  </Where></Query></View>`,
    };

    // Build archive filter per list: old lists use eldStatus, new list (ID === 2) uses Status
    let filterMyInquiries: string;
    
    // Debug logging for Internal Mobility archive
    if (item.id === 4) {
      console.log('[Archive Debug] Processing Internal Mobility archive');
      console.log('[Archive Debug] userAccountName:', userAccountName);
      console.log('[Archive Debug] endDate:', endDate);
      console.log('[Archive Debug] pastTwoWeeks:', pastTwoWeeks);
    }
    
    if (item.id === 2) {
      // New HR list: Status column and English status values
      // Archived states: approved, rejected, canceled, completed
      // NOTE: for HR we fetch all items in this state and decide in code
      // whether the current user opened or approved them (Author/Editor).
      filterMyInquiries = `((Status eq 'approved' or Status eq 'rejected' or Status eq 'canceled' or Status eq 'completed')
  and Modified le datetime'${endDate}' and Modified ge datetime'${pastTwoWeeks}')`;
    } else if (item.id === 4) {
      // Internal Mobility: check BOTH Status (new app) and eldStatus (old app)
      filterMyInquiries = `(((Status eq 'approved' or Status eq 'rejected' or Status eq 'canceled' or Status eq 'completed') or (eldStatus eq 'אושרה' or eldStatus eq 'נדחתה' or eldStatus eq 'בוטלה')) and Author/Name eq '${userAccountName}'
  and Modified le datetime'${endDate}' and Modified ge datetime'${pastTwoWeeks}')`;
    } else {
      // Existing lists schema: eldStatus column and Hebrew status values
      filterMyInquiries = `((eldStatus eq 'אושרה' or eldStatus eq 'נדחתה' or eldStatus eq 'בוטלה') and Author/Name eq '${userAccountName}'
  and Modified le datetime'${endDate}' and Modified ge datetime'${pastTwoWeeks}')`
    }
    try {
      // נבנה את השאילתה בהתאם לסוג הטופס
      let selectFields = "*,Author/UserName,Author/SipAddress,Author/EMail,Author/Name,Author/Title,Editor/EMail,Editor/Title";
      let expandFields = "Author,Editor";

      if (item.formId == 222) {
        // עבור טופס WOW - נוסיף את השדות המיוחדים
        selectFields += ",eldEmpFullName/Title,eldReceiverName/Title";
        expandFields += ",eldEmpFullName,eldReceiverName";
      }

      let itemsTreatedByMe: any[] = [];
      let itemsOpenedByMe: any[] = [];

      if (item.id === 2 || item.id === 4) {
        // New HR list or Internal Mobility: fetch all final-state items within the date range.
        // We'll determine in code whether the current user opened or approved them.
        itemsOpenedByMe = await web
          .getList(item.listUrl)
          .items.filter(filterMyInquiries)
          .select(selectFields)
          .expand(expandFields)();
      } else {
        [itemsTreatedByMe, itemsOpenedByMe] = await Promise.all([
          web
            .getList(item.listUrl)
            .getItemsByCAMLQuery(queryTreatedByMe, "FieldValuesAsText"),
          web
            .getList(item.listUrl)
            .items.filter(filterMyInquiries)
            .select(selectFields)
            .expand(expandFields)(),
        ]);
      }

      // Legacy lists: behavior unchanged
      itemsTreatedByMe.forEach((inquiryRaw) => {
        const inquiry = this.normalizeInquiryItemForUi(item, inquiryRaw);
        res.push(this.createArchiveMyInquiryItem(inquiry, false));
      });

      if (item.id === 2 || item.id === 4) {
        // HR list or Internal Mobility: partition items by role based on Author/Editor email
        const sp = spfi().using(SPFx(context));
        const currentUser = await sp.web.currentUser();
        const currentEmail = (currentUser.Email || "").toLowerCase();

        itemsOpenedByMe.forEach((inquiryRaw) => {
          const normalized = this.normalizeInquiryItemForUi(item, inquiryRaw);
          const authorEmail = (normalized.Author?.EMail || "").toLowerCase();
          const editorEmail = (normalized.Editor?.EMail || "").toLowerCase();

          if (authorEmail === currentEmail) {
            // Opened by me
            res.push(this.createArchiveMyInquiryItem(normalized, true));
          } else if (editorEmail === currentEmail) {
            // Approved by me (last modifier)
            res.push(this.createArchiveMyInquiryItem(normalized, false));
          }
        });
      } else {
        // Legacy lists: items opened by me (Author == userAccountName)
        itemsOpenedByMe.forEach((inquiryRaw) => {
          const inquiry = this.normalizeInquiryItemForUi(item, inquiryRaw);
          res.push(this.createArchiveMyInquiryItem(inquiry, true));
        });
      }
    } catch (error) { }
    return res;
  }

  private async getFormsManagementListItems(
    context: ISPFXContext,
    list: string
  ) {
    const res: Array<any> = [];
    const sp = spfi().using(SPFx(context));

    // הבאת כל הפריטים מהרשימה
    const items = await sp.web.getList(list).items();

    for (const item of items) {
      if (item.eldFormList) {
        const web = item.eldFormList;
        // Base web URL: everything before "/Lists" (handles HR and legacy forms uniformly)
        let webUrl = web.Url.slice(0, web.Url.indexOf("/Lists"));
        const formId = item.eldFormID;

        // Relative list URL (remove protocol + host), works for both HR and legacy lists
        const listUrl: string = web.Url.replace(
          window.location.protocol + "//" + window.location.host,
          ""
        );

        res.push({
          webUrl: webUrl,
          listUrl: listUrl,
          formHandlingPeriod: item.eldFormHandlingPeriod,
          formId: formId,
          id: item.ID,
          // Base form URL (Power Apps) from lstFormsManagmentList.eldFormLink
          formLinkUrl: item.eldFormLink?.Url || item.eldFormLink,
        });
      }
    }

    return res;
  }


  private createFormItem(item: any): IFormItem {
    return {
      title: item.Title,
      link: { Url: item.eldFormLink.Url },
    };
  }
  public async getAllFormsItems(
    context: ISPFXContext,
    list: string
  ): Promise<IFormItem[]> {
    let res: IFormItem[] = [];
    const sp = spfi().using(SPFx(context));
    const query = {
      ViewXml: `<View><Query><Where> 
        <And>
    <Eq><FieldRef Name="IsNew" /><Value Type="Boolean">1</Value></Eq> 
        <Or>
          <IsNull><FieldRef Name='eldAudiences' /></IsNull>
        <Or>
         <Membership Type='CurrentUserGroups'><FieldRef Name='eldAudiences'/></Membership>
        <Eq>
         <FieldRef Name='eldAudiences'></FieldRef>
         <Value Type='User'><UserID/></Value>
       </Eq>
      </Or>
     </Or> 
     </And> 
     </Where></Query></View>`,
    };
    const items = await sp.web
      .getList(list)
      .getItemsByCAMLQuery(query, "FieldValuesAsText");
    items.forEach((item) => res.push(this.createFormItem(item)));
    return res;
  }
}

export const MyInquiriesService = new myInquiriesService();
