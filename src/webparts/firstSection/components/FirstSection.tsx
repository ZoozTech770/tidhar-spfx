import * as React from 'react';
import { IFirstSectionProps } from './IFirstSectionProps';
import Events from '../../events/components/Events';
import Jobs from "../../jobs/components/Jobs";
import PendingApproval from "../../../webparts/pendingApproval/components/PendingApproval";
import MyInquiries from '../../myInquiries/components/MyInquiries';
import "./FirstSection.scss";
const FirstSection: React.FC<IFirstSectionProps> = (props) => {
  const {
    eventsProps,
    jobsProps,
    pendingApprovalProps,
    myInquiriesProps
  } = props;


  return (
    <div className='first-section'>
      <div className='wrapper'>
        <div className='right-column'>
          <Events {...eventsProps} />
        </div>
        <div className='middle-column'>
          <Jobs {...jobsProps} />
        </div>
        <div className='left-column'>
          {myInquiriesProps.showPendingApproval && <PendingApproval {...pendingApprovalProps} />}
          <div id={'my_inquiries'}><MyInquiries {...myInquiriesProps} /></div>
        </div>
      </div>
    </div>





  );
}
export default FirstSection;
