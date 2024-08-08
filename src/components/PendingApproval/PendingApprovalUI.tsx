import * as React from 'react';
import { IPendingApproval } from '../../interfaces/IPendingApproval';
import "./PendingApproval.scss";
const PendingApprovalUI: React.FC<IPendingApproval> = (props) => {
  const {
    Title,
    PendingCount,
    ExceededCount,
    ToAllUrl
  } = props;

  return (
    <a href={ToAllUrl.Url} target={ToAllUrl.OpenURLInNewTab ? '_blank' : '_self'} data-interception="off" className='pending-approval-container'>
      <div className='title'>{Title} ({PendingCount})</div>
      <div className='exceeded'>{ExceededCount} חורגות מזמן סבב</div>
      <div className='link'>
        {ToAllUrl.Text}<div className='arrow-icon'></div>
      </div>
    </a>
  );
}
export default PendingApprovalUI;