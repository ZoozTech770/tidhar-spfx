import * as React from 'react';
import { useState, useEffect } from 'react';
import { IPendingApprovalProps } from './IPendingApprovalProps';
import {PendingApprovalService} from '../../../services/PendingApprovalService';
import PendingApprovalUI from '../../../components/PendingApproval/PendingApprovalUI';
import {pendingApproval} from '../../../types/TPendingApproval';

const  PendingApproval:  React.FC<IPendingApprovalProps> =  (props) => {
  const {
    title,
    list,
    list2,
    hrApproversList,
    hrRequestsList,
    toAllLinkNewTab,
    toAllLinkTitle,
    toAllLinkUrl,
    context
  } = props;

  const [pendingApproval, setPendingApproval] = useState<pendingApproval>({exceededCount:null,pendingCount:null});
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);

     useEffect(() => {
       (async () => {
          const rawResponse = await PendingApprovalService.getIfCurrentUserApproval(context);
          setHasPermissions(rawResponse);
       })();
     }, []);
     useEffect(() => {
      (async () => {
        if (hasPermissions) {
          const summary = await PendingApprovalService.getPendingApprovalHomeWithHr(
            context,
            list,
            list2,
            hrApproversList,
            hrRequestsList,
          );
          setPendingApproval(summary);
        }
      })();
    }, [hasPermissions, list, list2, hrApproversList, hrRequestsList, context]);
  
  return (
    hasPermissions?
     <PendingApprovalUI
       Title={title}
       PendingCount={pendingApproval.pendingCount}
       ExceededCount={pendingApproval.exceededCount}
       ToAllUrl={{Text:toAllLinkTitle,Url:toAllLinkUrl,OpenURLInNewTab:toAllLinkNewTab}}
       />:null
  );
  
}
export default PendingApproval;


