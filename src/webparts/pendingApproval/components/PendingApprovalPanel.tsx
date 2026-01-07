import * as React from 'react';
import { useState, useEffect } from 'react';
import { PendingApprovalService } from '../../../services/PendingApprovalService';
import PendingApprovalUI from '../../../components/PendingApproval/PendingApprovalUI';
import { pendingApproval } from '../../../types/TPendingApproval';
import { IPendingApprovalPanelProps } from './IPendingApprovalPanelProps';

const PendingApprovalPanel: React.FC<IPendingApprovalPanelProps> = (props) => {
  const {
    title,
    list,
    list2,
    hrApproversList,
    hrRequestsList,
    mobilityApproversList,
    mobilityRequestsList,
    toAllLinkNewTab,
    toAllLinkTitle,
    toAllLinkUrl,
    context,
  } = props;

  const [pendingApprovalData, setPendingApprovalData] = useState<pendingApproval>({
    exceededCount: null,
    pendingCount: null,
  });
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
          mobilityApproversList,
          mobilityRequestsList
        );
        setPendingApprovalData(summary);
      }
    })();
  }, [hasPermissions, list, list2, hrApproversList, hrRequestsList, mobilityApproversList, mobilityRequestsList, context]);

  return hasPermissions ? (
    <PendingApprovalUI
      Title={title}
      PendingCount={pendingApprovalData.pendingCount}
      ExceededCount={pendingApprovalData.exceededCount}
      ToAllUrl={{ Text: toAllLinkTitle, Url: toAllLinkUrl, OpenURLInNewTab: toAllLinkNewTab }}
    />
  ) : null;
};

export default PendingApprovalPanel;
