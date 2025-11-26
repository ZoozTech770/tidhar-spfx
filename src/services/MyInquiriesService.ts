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

export default class myInquiriesService {
  private createArchiveMyInquiryItem(item: any, createdByMe: boolean) {
    return {
      title: item.eldFormName,
      date: new Date(item.Created),
      lastModified: new Date(item.Modified),
      createrOrApprover: createdByMe
        ? item.Editor.Title
        : item.FieldValuesAsText.Author,
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
    // Only apply normalization for the new list (ID === 2)
    if (listMeta.id === 2) {
      // Status -> eldStatus
      if (inquiry.Status !== undefined && inquiry.eldStatus === undefined) {
        inquiry.eldStatus = inquiry.Status;
      }

      // RequestType -> eldFormName (this is what the UI uses as the form title)
      if (inquiry.RequestType !== undefined && inquiry.eldFormName === undefined) {
        inquiry.eldFormName = inquiry.RequestType;
      }

      // Optionally also map to Title if it is used elsewhere
      if (inquiry.RequestType !== undefined && inquiry.Title === undefined) {
        inquiry.Title = inquiry.RequestType;
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
    } else {
      // Existing lists schema: eldStatus column and Hebrew status values
      filterMyInquiries = `((eldStatus eq 'בטיפול' or eldStatus eq 'טיוטה') and Modified ge datetime'${date}')`;
    }

    try {
      debugger
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
            let inquiryItem = this.createMyInquiryItem(inquiry, item.formHandlingPeriod);
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
    let today = new Date();
    //date = new Date(today.setDate(today.getDate()+2)).toISOString();
    let pastTwoYears = new Date(
      today.setFullYear(today.getFullYear() - 2)
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
    let filterMyInquiries = `((eldStatus eq 'אושרה' or eldStatus eq 'נדחתה' or eldStatus eq 'בוטלה') and Author/Name eq '${userAccountName}'
  and Modified le datetime'${date}' and Modified ge datetime'${pastTwoYears}')`;
    try {
      // נבנה את השאילתה בהתאם לסוג הטופס
      let selectFields = "*,Author/UserName,Author/SipAddress,Author/EMail,Author/Name,Author/Title,Editor/Title";
      let expandFields = "Author,Editor";

      if (item.formId == 222) {
        // עבור טופס WOW - נוסיף את השדות המיוחדים
        selectFields += ",eldEmpFullName/Title,eldReceiverName/Title";
        expandFields += ",eldEmpFullName,eldReceiverName";
      }

      const [itemsTreatedByMe, itemsOpenedByMe] = await Promise.all([
        await web
          .getList(item.listUrl)
          .getItemsByCAMLQuery(queryTreatedByMe, "FieldValuesAsText"),
        await web
          .getList(item.listUrl)
          .items.filter(filterMyInquiries)
          .select(selectFields)
          .expand(expandFields)(),
      ]);

      itemsTreatedByMe.forEach((inquiryRaw) => {
        const inquiry = this.normalizeInquiryItemForUi(item, inquiryRaw);
        res.push(this.createArchiveMyInquiryItem(inquiry, false));
      });

      itemsOpenedByMe.forEach((inquiryRaw) => {
        const inquiry = this.normalizeInquiryItemForUi(item, inquiryRaw);
        res.push(this.createArchiveMyInquiryItem(inquiry, true));
      });
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
        let webUrl = web.Url.slice(0, web.Url.indexOf("/Lists"));
        const formId = item.eldFormID;

        // --- שינוי URL לפי הצורך ---
        let listUrl: string;

        console.log('webUrl ', webUrl);
        console.log('web.Url ', web.Url);
        if (item.ID === 2) {
          webUrl = 'https://tidharconil.sharepoint.com/sites/SmartFormsHR'
          listUrl = "/sites/SmartFormsHR/Lists/zooz_hr_allRequests/AllItems.aspx";
        } else {
          // שאר הפריטים נשארים כמו שהם, URL יחסי
          listUrl = web.Url.replace(
            window.location.protocol + "//" + window.location.host,
            ""
          );


        }

        console.log('listUrl ', listUrl);
        res.push({
          webUrl: webUrl,
          listUrl: listUrl,
          formHandlingPeriod: item.eldFormHandlingPeriod,
          formId: formId,
          id: item.ID,
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
