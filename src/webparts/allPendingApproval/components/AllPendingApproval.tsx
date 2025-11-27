import * as React from 'react';
import { useState, useEffect } from 'react';
import { PendingApprovalService } from "../../../services/PendingApprovalService";
import { IAllPendingApprovalProps } from './IAllPendingApprovalProps';
import { IPendingApprovalItem } from '../../../interfaces/IPendingApproval';
import AllPendingApprovalsUI from '../../../components/AllPendingApprovalsUI/AllPendingApprovalsUI';
const AllPendingApproval: React.FC<IAllPendingApprovalProps> = (props) => {
  const {
    title,
    list,
    list2,
    hrApproversList,
    hrRequestsList,
    context,
  } = props;

  const [pendingApprovalItems, setPendingApprovalItems] = useState<IPendingApprovalItem[]>([]);
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const rawResponse = await PendingApprovalService.getIfCurrentUserApproval(context);
      setHasPermissions(rawResponse);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (hasPermissions) {
        setisLoading(true);

        // Legacy pending approvals (existing behavior)
        const legacyItems = await PendingApprovalService.getPendingApprovalItems(
          context,
          list,
          list2
        );

        // Optional: HR pending approvals from SmartFormsHR lists
        let hrItems: IPendingApprovalItem[] = [];
        if (hrApproversList && hrRequestsList) {
          try {
            hrItems = await PendingApprovalService.getPendingApprovalItemsHr(
              context,
              hrApproversList,
              hrRequestsList,
              list2
            );
          } catch (error) {
            console.error('Error fetching HR pending approval items', error);
          }
        }

        setPendingApprovalItems([...legacyItems, ...hrItems]);
        setisLoading(false);
      }
    })();
  }, [hasPermissions, list, list2, hrApproversList, hrRequestsList, context]);
  if (!isLoading) {

    return (
      hasPermissions && <AllPendingApprovalsUI pendingApprovals={pendingApprovalItems} title={title} />
    );
  }
  return null;
}
export default AllPendingApproval;
