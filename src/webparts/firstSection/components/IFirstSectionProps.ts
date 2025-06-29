import { IEventsProps } from "../../events/components/IEventsProps";
import { IMyInquiriesProps } from "../../myInquiries/components/IMyInquiriesProps";
import { IPendingApprovalProps } from "../../pendingApproval/components/IPendingApprovalProps";
import { IJobsProps } from "../../jobs/components/IJobsProps";

export interface IFirstSectionProps {
  eventsProps:IEventsProps;
  jobsProps:IJobsProps;
  pendingApprovalProps:IPendingApprovalProps;
  myInquiriesProps:IMyInquiriesProps;
}
