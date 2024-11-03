import { ISPFXContext, SPFx, spfi } from "@pnp/sp";
import { PermissionKind } from "@pnp/sp/security";

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import "@pnp/sp/site-users";
import "@pnp/sp/security/list";
import { pendingApproval } from '../types/TPendingApproval';
import { IPendingApprovalItem } from "../interfaces/IPendingApproval";
import { forEach } from "lodash";
var Set = require("es6-set");
const open = "בטיפול";
const query = {
  ViewXml: `<View><Query>
  <Where>
  <And>
    <Or>
      <Membership Type='CurrentUserGroups'><FieldRef Name='eldAwaitingFor'/></Membership>
      <Eq>
        <FieldRef Name='eldAwaitingFor'></FieldRef>
        <Value Type='User'><UserID/></Value>
     </Eq>
    </Or>
    <Eq>
      <FieldRef Name='eldStatus'></FieldRef>
      <Value Type='Text'>${open}</Value>
    </Eq>
  </And>
  </Where>
  </Query>
</View>`,
}

// <ViewFields>
// <FieldRef Name='eldFormName' />
// <FieldRef Name='Modified' />
// </ViewFields>
export default class pendingApprovalService {
  private createPendingItem(item: any, timeLeft: number) {
    return {
      Title: item.eldFormName,
      Sender: item.FieldValuesAsText.Author,
      OpenDate: item.Created,
      Url: item.eldFormLink?.Url,
      timeLeft: timeLeft
    }
  }

  //not in use
  public async getUserPermission(context: ISPFXContext, listUrl: string) {
    const sp = spfi().using(SPFx(context));
    const hasPermissions = sp.web.getList(listUrl).currentUserHasPermissions(PermissionKind.EditListItems);
    return hasPermissions;
  }

  private getDateDiff(date1: Date, date2: Date) {
    const difference: number = date2.getTime() - date1.getTime();
    return Math.ceil(difference / (1000 * 60 * 60 * 24))
  }
  public async getPendingApprovalItems(context: ISPFXContext, listUrl: string, signaturePeriodsListUrl: string): Promise<IPendingApprovalItem[]> {
    let res = [];
    const sp = spfi().using(SPFx(context));
    const items: any[] = await sp.web.getList(listUrl).getItemsByCAMLQuery(query, 'FieldValuesAsText');
    let onlyTitles: any[] = new Set(items.map((item: any) => item.eldFormName));
    let signaturesPeriods = await this.getSignaturePeriods(context, signaturePeriodsListUrl, onlyTitles);
    const today = new Date();
    
    items.forEach(item => {
      let signaturesPeriod = signaturesPeriods.filter(sigItem => sigItem.eldFormName == item.eldFormName);
      if (signaturesPeriod.length > 0) {
        const modifiedDate = new Date(item.Modified);
        modifiedDate.setDate(modifiedDate.getDate() + signaturesPeriod[0].eldApproverSignaturePeriod);
        
        let timeLeft = this.getDateDiff(today, modifiedDate);
        res.push(this.createPendingItem(item, timeLeft));
      } else {
        // itzhar hotfix - show hidden open cases
        const modifiedDate = new Date(item.Modified);
        //hardcoded eldApproverSignaturePeriod 3
        modifiedDate.setDate(modifiedDate.getDate() + 300);
        
        let timeLeft = this.getDateDiff(today, modifiedDate);
        res.push(this.createPendingItem(item, timeLeft));
      }
    });
    
    return res;
  }
  public async getPendingApprovalHome(context: ISPFXContext, listUrl: string, signaturePeriodsListUrl: string): Promise<pendingApproval> {
    const sp = spfi().using(SPFx(context));
    const items: any[] = await sp.web.getList(listUrl).getItemsByCAMLQuery(query, 'FieldValuesAsText');
    let onlyTitles: any[] = new Set(items.map((item: any) => item.eldFormName));
    let signaturesPeriods = await this.getSignaturePeriods(context, signaturePeriodsListUrl, onlyTitles);
    
    let exceededCount = 0;
    const today = new Date();
    items.forEach(item => {
      let signaturesPeriod = signaturesPeriods.filter(sigItem => sigItem.eldFormName == item.eldFormName);
      if (signaturesPeriod.length > 0) {
        let diff = this.getDateDiff(today, new Date(item.Modified))
        if (diff > signaturesPeriod[0].eldApproverSignaturePeriod)
          exceededCount++;
      }
    });
    return { exceededCount: exceededCount, pendingCount: items.length };
  }

  public async getSignaturePeriods(context: ISPFXContext, listUrl: string, myItems: string[]): Promise<any[]> {
    const sp = spfi().using(SPFx(context));
    let query = "";
    myItems.forEach(item => {
      if (query == "")
        query = `eldFormName eq '${item}'`;
      else
        query += ` or eldFormName eq '${item}'`;
    });
    const items: any[] = await sp.web.getList(listUrl).items.filter(query).select('eldApproverSignaturePeriod', 'eldFormName')();
    return items;
  }
  private createMyArchivePendingApproval(item: any) {
    return {
      title: item.Title,
      date: new Date(item.Created),
      lastModified: new Date(item.Modified),
      createrOrApprover: item.FieldValuesAsText.Author,
      status: item.eldStatus,
      link: { Url: item.eldFormLink },
      formHandlingPeriod: 0,
      createdByMe: false
    }
  }
  public async getArchivePendingApproval(context: ISPFXContext, listUrl: string) {
    const sp = spfi().using(SPFx(context));
    let today = new Date();
    let pastTwoYears = new Date(today.setFullYear(today.getFullYear() - 2)).toISOString()
    const archiveQuery = {
      ViewXml: `<View><Query>
      <Where>
      <And>
        <Or>
          <Membership Type='CurrentUserGroups'><FieldRef Name='eldTreatedBy'/></Membership>
          <Eq>
            <FieldRef Name='eldTreatedBy'></FieldRef>
            <Value Type='User'><UserID/></Value>
         </Eq>
        </Or> 
        <Gt><FieldRef Name='Created'/><Value Type='DateTime'>` + pastTwoYears + `</Value></Gt></And>
      </Where>
      </Query>
    </View>`,
    }
    let res = [];
    const items: any[] = await sp.web.getList(listUrl).getItemsByCAMLQuery(archiveQuery, 'FieldValuesAsText');
    items.forEach(item =>
      res.push(this.createMyArchivePendingApproval(item)));
    return res;
  }

  public async getIfCurrentUserApproval(context: ISPFXContext) {
    const sp = spfi().using(SPFx(context));
    const groups = sp.web.currentUser.groups();
    const approversGroup = (await groups).filter(g => g.Title == "FormApprovers");
    return approversGroup.length > 0;
  }
}
export const PendingApprovalService = new pendingApprovalService()
