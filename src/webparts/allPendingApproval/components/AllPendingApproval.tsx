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
    context
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
        setisLoading(true)
        const rawResponse = await PendingApprovalService.getPendingApprovalItems(context, list, list2);
        setPendingApprovalItems(rawResponse);
        setisLoading(false);
      }
    })();
  }, [hasPermissions]);
  if (!isLoading) {

    return (
      hasPermissions && <AllPendingApprovalsUI pendingApprovals={pendingApprovalItems} title={title} />
    );
  }
  return null;
}
export default AllPendingApproval;
