import * as React from 'react';
import { IPendingApprovalItem } from '../../interfaces/IPendingApproval';
import useDateFormatter from '../../util/useDateFormatter';
import classes from './AllPendingApprovalsUI.module.scss';

type AllPendingApprovalsUIProps = {
  pendingApprovals: IPendingApprovalItem[];
  title: string;
}

const AllPendingApprovalsUI = ({ pendingApprovals, title }: AllPendingApprovalsUIProps) => {

  const { formatDate } = useDateFormatter();

  const getDaysPassedText = (days: number) => {
    if (days === 0) {
      return 'היום';
    }
    return `עברו ${days} ימים`;
  }

  const onRowClick = (href: string) => {
    window.open(href, '_blank');
  }
  if (pendingApprovals) {
    return (
      <div className={classes.pendingApprovalsContainer}>
        <h2 className={classes.pendingApprovalsTitle}>{title}</h2>
        {(pendingApprovals.length > 0) ?
          <>
            <table className={classes.pendingApprovalsTable}>
              <thead className={classes.pendingApprovalsThead}>
                <th>שם הטופס</th>
                <th>מגיש הטופס</th>
                <th>תאריך פתיחת הטופס</th>
                <th>זמן שעבר מהגשת הטופס</th>
              </thead>
              <tbody className={classes.pendingApprovalsTbody}>
                {pendingApprovals.map((pendingApproval: IPendingApprovalItem) => {
                  return (
                    <tr className={classes.mainTr} onClick={() => onRowClick(pendingApproval.Url)} aria-label={"יש ללחוץ על השורה על מנת לפתוח את הטופס"}>
                      <td>{pendingApproval.Title}</td>
                      <td>{pendingApproval.Sender}</td>
                      <td>{formatDate(new Date(pendingApproval.OpenDate))}</td>
                      <td>{getDaysPassedText(pendingApproval.daysSinceOpen)}</td>
                    </tr>)
                })}
              </tbody>
            </table>
            <div className={classes.pendingApprovalsCards}>
              {pendingApprovals.map(pendingApproval => {
                return <a className={classes.pendingApprovalCardContainer} href={pendingApproval.Url} target={"_blank"}>
                  <div className={classes.pendingApprovalTitle}>{pendingApproval.Title}</div>
                  <table className={classes.mobilePendingApprovalTable}>
                    <thead>
                      <th>מגיש הטופס</th>
                      <th>תאריך פתיחת הטופס</th>
                      <th>זמן שעבר מהגשת הטופס</th>
                    </thead>
                    <tbody>
                      <td>{pendingApproval.Sender}</td>
                      <td>{formatDate(new Date(pendingApproval.OpenDate))}</td>
                      <td>{getDaysPassedText(pendingApproval.daysSinceOpen)}</td>
                    </tbody>
                  </table>
                </a>
              })}
            </div>
          </>
          :
          <div>אין נתונים להצגה.</div>}
      </div>
    )
  }
  return null;

}
export default AllPendingApprovalsUI