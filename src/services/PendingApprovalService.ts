import { ISPFXContext, SPFx, spfi } from "@pnp/sp";
import { PermissionKind } from "@pnp/sp/security";

import "@pnp/sp/webs";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import "@pnp/sp/site-users";
import "@pnp/sp/security/list";
import { pendingApproval } from '../types/TPendingApproval';
import { IPendingApprovalItem } from "../interfaces/IPendingApproval";
import { forEach } from "lodash";
var Set = require("es6-set");

// TEMP: explicit HR Power Apps base URL until lstFormsManagmentList (ID=2).eldFormLink is updated
// Do NOT include reqId here; it is appended in code.
const HR_APP_BASE_URL = "https://apps.powerapps.com/play/e/85b73110-9842-e983-bdbb-d61c175c1c5d/a/28a2a67d-edc3-41c3-8924-97e1bb8b37ac?tenantId=47339e34-e7be-4166-9485-70ccbd784a21&hint=cefce19f-00c1-4cb6-8310-7f4268c6da4d";

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
    const created = new Date(item.Created);
    const today = new Date();
    const daysSinceOpen = this.getWholeDaysBetween(created, today);

    return {
      Title: item.eldFormName,
      Sender: item.FieldValuesAsText.Author,
      OpenDate: item.Created,
      Url: item.eldFormLink?.Url,
      timeLeft: timeLeft,
      daysSinceOpen,
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

  /**
   * Whole days between two dates, based on calendar days (ignores time-of-day).
   * Used for "days since open" so that same-day items show 0, next day shows 1, etc.
   */
  private getWholeDaysBetween(date1: Date, date2: Date) {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    const difference: number = d2.getTime() - d1.getTime();
    const dayMs = 1000 * 60 * 60 * 24;
    return Math.max(0, Math.floor(difference / dayMs));
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

/**
   * Get pending HR approvals (SmartFormsHR) for the current user.
   * Uses:
   * - zooz_hr_approvers: RequestType + ApproversMail (";"-separated emails)
   * - zooz_hr_allRequests: RequestType + Status = 'in process'
   * - lstFormsManagmentList (signaturePeriodsListUrl): item ID 2 for eldApproverSignaturePeriod + eldFormLink (base Power Apps URL)
   */
  public async getPendingApprovalItemsHr(
    context: ISPFXContext,
    hrApproversListUrl: string,
    hrRequestsListUrl: string,
    signaturePeriodsListUrl: string,
  ): Promise<IPendingApprovalItem[]> {
    const sp = spfi().using(SPFx(context));

    // Resolve SmartFormsHR web (same tenant, different site collection)
    const hrWeb = this.getHrWeb(context, hrApproversListUrl, hrRequestsListUrl);

    // 1. Current user's email (normalized to lowercase)
    const currentUser = await sp.web.currentUser();
    const userEmail: string = (currentUser.Email || '').toLowerCase();
    if (!userEmail) {
      return [];
    }

    // 2. HR approver rows where ApproversMail contains the current user's email
    let approverRows: any[] = [];
    try {
      approverRows = await hrWeb
        .getList(hrApproversListUrl)
        .items.select('RequestType', 'ApproversMail')();
    } catch (error) {
      console.error('Error fetching HR approvers list:', error);
      return [];
    }

    const requestTypes = this.getHrRequestTypesForUser(approverRows, userEmail);
    if (!requestTypes.length) {
      return [];
    }

    // 3. Fetch HR signature period & base URL from lstFormsManagmentList item ID 2
    const { signaturePeriodDays, baseFormUrl } = await this.getHrSignatureConfig(sp, signaturePeriodsListUrl);

    // 4. Build OData filter for HR requests: Status == 'in process' AND RequestType in my types
    const typeFilter = requestTypes
      .map(t => `RequestType eq '${t.replace(/'/g, "''")}'`)
      .join(' or ');

    const filter = `(Status eq 'in process') and (${typeFilter})`;

    let hrItems: any[] = [];
    try {
      hrItems = await hrWeb
        .getList(hrRequestsListUrl)
        .items.filter(filter)
        .select('ID', 'RequestType', 'Status', 'Created', 'Modified', 'Author/EMail', 'Author/Title')
        .expand('Author')();
    } catch (error) {
      console.error('Error fetching HR requests list:', error);
      return [];
    }

    const today = new Date();

    // 5. Shape into IPendingApprovalItem[]
    return hrItems.map(item => {
      const modified = new Date(item.Modified);
      modified.setDate(modified.getDate() + signaturePeriodDays);
      const timeLeft = this.getDateDiff(today, modified);

      const created = new Date(item.Created);
      const daysSinceOpen = this.getWholeDaysBetween(created, today);

      let url = hrRequestsListUrl as string;
      if (baseFormUrl) {
        const separator = baseFormUrl.includes('?') ? '&' : '?';
        url = `${baseFormUrl}${separator}reqId=${item.ID}`;
      }

      const sender = item.Author?.Title || item.Author?.EMail || '';

      return {
        Title: item.RequestType,
        Sender: sender,
        OpenDate: new Date(item.Created),
        Url: url,
        timeLeft,
        daysSinceOpen,
      } as IPendingApprovalItem;
    });
  }

  /** Resolve the SmartFormsHR web from one of the HR list URLs. */
  private getHrWeb(
    context: ISPFXContext,
    primaryListUrl?: string,
    secondaryListUrl?: string,
  ) {
    const anyHrListUrl = primaryListUrl || secondaryListUrl;
    if (!anyHrListUrl) {
      throw new Error('HR list URL is required to resolve SmartFormsHR web');
    }

    // Expect "/sites/SmartFormsHR/Lists/..."; take the part before "/Lists"
    const listsIndex = anyHrListUrl.toLowerCase().indexOf('/lists/');
    let hrSiteRelative = listsIndex > -1 ? anyHrListUrl.substring(0, listsIndex) : anyHrListUrl;

    // Normalize to start with '/' so we don't end up with '...comsites/...'
    if (!hrSiteRelative.startsWith('/')) {
      hrSiteRelative = '/' + hrSiteRelative;
    }

    const hrSiteAbsolute = `${window.location.protocol}//${window.location.host}${hrSiteRelative}`;
    return Web(hrSiteAbsolute).using(SPFx(context));
  }

  /** Extract distinct RequestType values for which the given user is an approver. */
  private getHrRequestTypesForUser(approverRows: any[], userEmail: string): string[] {
    const lowerUser = userEmail.toLowerCase();

    const types = approverRows
      .filter(row => !!row.RequestType && !!row.ApproversMail)
      .filter(row => {
        const emails = (row.ApproversMail as string)
          .split(';')
          .map((e: string) => e.trim().toLowerCase())
          .filter((e: string) => !!e);
        return emails.includes(lowerUser);
      })
      .map(row => String(row.RequestType));

    return Array.from(new Set(types));
  }

  /** Read HR signature period + base form URL from lstFormsManagmentList (item ID 2). */
  private async getHrSignatureConfig(sp: any, signaturePeriodsListUrl: string): Promise<{ signaturePeriodDays: number; baseFormUrl?: string }> {
    let signaturePeriodDays = 0;
    let baseFormUrl: string | undefined;

    try {
      const hrConfig = await sp.web
        .getList(signaturePeriodsListUrl)
        .items.getById(2)
        .select('eldApproverSignaturePeriod', 'eldFormLink')();

      signaturePeriodDays = hrConfig.eldApproverSignaturePeriod || 0;

      // TEMP override: use hard-coded HR Power Apps URL until FormLink is updated in lstFormsManagmentList (ID=2)
      baseFormUrl = HR_APP_BASE_URL;
      // When FormLink is correct, switch back to:
      // baseFormUrl = hrConfig.eldFormLink?.Url || hrConfig.eldFormLink;
    } catch (error) {
      console.error('Error fetching HR signature period configuration from lstFormsManagmentList (ID=2):', error);
      // If we cannot read config, still show items with a large default period
      signaturePeriodDays = 300;
    }

    return { signaturePeriodDays, baseFormUrl };
  }

  /**
   * Summary for PendingApproval tiles: legacy + optional HR totals.
   */
  public async getPendingApprovalHomeWithHr(
    context: ISPFXContext,
    listUrl: string,
    signaturePeriodsListUrl: string,
    hrApproversListUrl?: string,
    hrRequestsListUrl?: string,
  ): Promise<pendingApproval> {
    const legacy = await this.getPendingApprovalHome(context, listUrl, signaturePeriodsListUrl);

    let hrPending = 0;
    let hrExceeded = 0;

    if (hrApproversListUrl && hrRequestsListUrl) {
      try {
        const hrItems = await this.getPendingApprovalItemsHr(
          context,
          hrApproversListUrl,
          hrRequestsListUrl,
          signaturePeriodsListUrl,
        );
        hrPending = hrItems.length;
        hrExceeded = hrItems.filter(i => i.timeLeft < 0).length;
      } catch (error) {
        console.error('Error fetching HR pending approval summary:', error);
      }
    }

    return {
      exceededCount: legacy.exceededCount + hrExceeded,
      pendingCount: legacy.pendingCount + hrPending,
    };
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
