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

    let filterMyInquiries = `((eldStatus eq 'בטיפול' or eldStatus eq 'טיוטה') 
                           and Modified ge datetime'${date}')`;

    try {
      let items = [];
      try {
        items = await web
          .getList(item.listUrl)
          .items.filter(filterMyInquiries)
          .select(
            "*,Author/UserName,Author/SipAddress,Author/EMail,Author/Name,Author/Title,Editor/Title"
          )
          .expand("Author,Editor")();
      } catch (error) {
        console.error(`Error fetching list at ${item.listUrl}:`, error);
        items = [];
      }

      for (const inquiry of items) {
        try {
          if (inquiry.Author && inquiry.Author.EMail === userEmail) {
            let inquiryItem = this.createMyInquiryItem(inquiry, item.formHandlingPeriod);
            if (item.formId == 222) {
              inquiryItem.receiverName = inquiry?.FieldValuesAsText?.eldReceiverName;
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
      const [itemsTreatedByMe, itemsOpenedByMe] = await Promise.all([
        await web
          .getList(item.listUrl)
          .getItemsByCAMLQuery(queryTreatedByMe, "FieldValuesAsText"),
        await web
          .getList(item.listUrl)
          .items.filter(filterMyInquiries)
          .select(
            "*,Author/UserName,Author/SipAddress,Author/EMail,Author/Name,Author/Title,Editor/Title"
          )
          .expand("Author,Editor")(),
      ]);
      itemsTreatedByMe.forEach((inquiry) =>
        res.push(this.createArchiveMyInquiryItem(inquiry, false))
      );
      itemsOpenedByMe.forEach((inquiry) =>
        res.push(this.createArchiveMyInquiryItem(inquiry, true))
      );
    } catch (error) { }
    return res;
  }

  private async getFormsManagementListItems(
    context: ISPFXContext,
    list: string
  ) {
    let res = new Array();
    const sp = spfi().using(SPFx(context));
    await sp.web
      .getList(list)
      .items()
      .then((items) => {
        items.forEach((item) => {
          if (item.eldFormList) {
            const web = item.eldFormList;
            const webUrl = web.Url.slice(0, web.Url.indexOf("/Lists"));
            const formId = item.eldFormID;
            const listUrl = web.Url.replace(
              window.location.protocol + "//" + window.location.host,
              ""
            );
            res.push({
              webUrl: webUrl,
              listUrl: listUrl,
              formHandlingPeriod: item.eldFormHandlingPeriod,
              formId: formId
            });
          }
        });
      });
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
