import * as React from 'react';
import { IFirstSectionProps } from './IFirstSectionProps';
import Events from '../../events/components/Events';
import Projects from "../../projects/components/Projects";
import PendingApproval from "../../../webparts/pendingApproval/components/PendingApproval";
import MyInquiries from '../../myInquiries/components/MyInquiries';
import "./FirstSection.scss";
const FirstSection: React.FC<IFirstSectionProps> = (props) => {
  const {
    eventsProps,
    projectsProps,
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
          <Projects {...projectsProps} />
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
