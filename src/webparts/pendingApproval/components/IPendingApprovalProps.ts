export interface IPendingApprovalProps {
  title: string;
  list: string;
  list2: string;
  /** Optional: HR approvers list (zooz_hr_approvers) */
  hrApproversList?: string;
  /** Optional: HR requests list (zooz_hr_allRequests) */
  hrRequestsList?: string;
  toAllLinkTitle: string;
  toAllLinkUrl: string;
  toAllLinkNewTab: boolean;
  context: any;
}
