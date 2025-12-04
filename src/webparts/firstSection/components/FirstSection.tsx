import * as React from 'react';
import { IFirstSectionProps } from './IFirstSectionProps';
import CalendarPanel from '../../calendar/components/CalendarPanel';
import JobsPanel from "../../jobs/components/JobsPanel";
import PendingApprovalPanel from "../../pendingApproval/components/PendingApprovalPanel";
import MyInquiriesPanel from '../../myInquiries/components/MyInquiriesPanel';
import "./FirstSection.scss";

const FirstSection: React.FC<IFirstSectionProps> = (props) => {
  const {
    calendarProps,
    jobsProps,
    pendingApprovalProps,
    myInquiriesProps
  } = props;

  return (
    <div className='first-section'>
      <div className='wrapper'>
        <div className='right-column'>
          <CalendarPanel {...calendarProps} />
        </div>
        <div className='middle-column'>
          <JobsPanel {...jobsProps} />
        </div>
        <div className='left-column'>
          {myInquiriesProps.showPendingApproval && <PendingApprovalPanel {...pendingApprovalProps} />}
          <div id={'my_inquiries'}><MyInquiriesPanel {...myInquiriesProps} /></div>
        </div>
      </div>
    </div>
  );
}
export default FirstSection;
