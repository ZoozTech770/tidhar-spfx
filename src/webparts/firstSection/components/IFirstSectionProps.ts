import { IEventsProps } from "../../events/components/IEventsProps";
import { IMyInquiriesProps } from "../../myInquiries/components/IMyInquiriesProps";
import { IPendingApprovalProps } from "../../pendingApproval/components/IPendingApprovalProps";
import { IProjectsProps } from "../../projects/components/IProjectsProps";

export interface IFirstSectionProps {
  eventsProps:IEventsProps;
  projectsProps:IProjectsProps;
  pendingApprovalProps:IPendingApprovalProps;
  myInquiriesProps:IMyInquiriesProps;
}