import * as React from 'react';
import classes from './MyArchiveUI.module.scss';
import { IArchiveInquiriesItem } from '../../interfaces/IInquiriesItem';
import useDateFormatter from '../../util/useDateFormatter';

type MyArchiveUIProps = {
    title: string;
    archiveItems: IArchiveInquiriesItem[];
}

const MyArchiveUI = ({ title, archiveItems }: MyArchiveUIProps) => {

    const { formatDate } = useDateFormatter();

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'בטיפול':
                return classes.inProgress
            case 'אושרה':
                return classes.approved
            case 'נדחתה':
                return classes.declined
            case 'בוטלה':
                return classes.canceled
            case 'טיוטה':
                return classes.draft
            default:
                return ""
        }
    }

    const onRowClick = (href: string) => {
        window.open(href, '_blank');
    }

    return (
        <div className={classes.archiveContainer}>
            <h2 className={classes.myArchiveTitle}>{title}</h2>
            {(archiveItems && archiveItems.length > 0) ?
                <>
                    <table className={classes.archiveTable}>
                        <thead className={classes.archiveThead}>
                            <th>שם הטופס</th>
                            <th>תאריך הגשת הטופס</th>
                            <th>תאריך סגירת הטופס</th>
                            <th>סטטוס</th>
                            <th>מאשר/יוצר</th>
                        </thead>
                        <tbody className={classes.archiveTbody}>
                            {archiveItems.map((item: IArchiveInquiriesItem) => {
                                return <tr className={classes.mainTr} onClick={() => onRowClick(item.link.Url)} aria-label={"יש ללחוץ על השורה על מנת לפתוח את הטופס"}>
                                    <td>
                                        <div>
                                            {item.title}
                                        </div>
                                    </td>
                                    <td>{formatDate(item.date)}</td>
                                    <td>{formatDate(item.lastModified)}</td>
                                    <td><div className={classes.status + ' ' + getStatusClass(item.status)}>{item.status}</div></td>
                                    <td>
                                        <div>
                                            <div>{item.createrOrApprover}</div>
                                        </div>
                                        <div className={item.createdByMe ? classes.creator : classes.approver}>
                                            {item.createdByMe ? 'מאשר' : 'יוצר'}
                                        </div>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <div className={classes.archiveCards}>
                        {archiveItems.map(item => {
                            return <a className={classes.archiveCardContainer} href={item.link.Url} target={'_blank'}>
                                <div className={classes.archiveTitle}>{item.title}</div>
                                <table className={classes.mobileArchiveTable}>
                                    <thead>
                                        <th>תאריך הגשת הטופס</th>
                                        <th>תאריך סגירת הטופס</th>
                                        <th>סטטוס</th>
                                        <th>מאשר/יוצר</th>
                                    </thead>
                                    <tbody>
                                        <td>{formatDate(item.date)}</td>
                                        <td>{formatDate(item.lastModified)}</td>
                                        <td><div className={classes.status + ' ' + getStatusClass(item.status)}>{item.status}</div></td>
                                        <td>
                                            <div>
                                                <div>{item.createrOrApprover}</div>
                                            </div>
                                            <div className={item.createdByMe ? classes.creator : classes.approver}>
                                                {item.createdByMe ? 'יוצר' : 'מאשר'}
                                            </div>
                                        </td>
                                    </tbody>
                                </table>
                            </a>
                        })}
                    </div>
                </>
                :
                <div>אין נתונים להצגה.</div>
            }
        </div>
    )
}
export default MyArchiveUI