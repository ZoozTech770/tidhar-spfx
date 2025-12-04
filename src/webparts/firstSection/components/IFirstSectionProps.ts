import { ICalendarPanelProps } from "../../calendar/components/ICalendarPanelProps";
import { IMyInquiriesPanelProps } from "../../myInquiries/components/IMyInquiriesPanelProps";
import { IPendingApprovalPanelProps } from "../../pendingApproval/components/IPendingApprovalPanelProps";
import { IJobsPanelProps } from "../../jobs/components/IJobsPanelProps";

export interface IFirstSectionProps {
  calendarProps: ICalendarPanelProps;
  jobsProps: IJobsPanelProps;
  pendingApprovalProps: IPendingApprovalPanelProps;
  myInquiriesProps: IMyInquiriesPanelProps;
}
