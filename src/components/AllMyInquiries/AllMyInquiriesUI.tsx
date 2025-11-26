import * as React from 'react';
import { IInquiriesItem } from '../../interfaces/IInquiriesItem';
import classes from './AllMyInquiriesUI.module.scss';
import useDateFormatter from '../../util/useDateFormatter';

type AllMyInquiriesUIProps = {
  inquiries: IInquiriesItem[];
  title: string;
}

const InfoIcon = require('../../assets/icons/info.svg');
const InfoDarkIcon = require('../../assets/icons/info-dark.svg');

const AllMyInquiriesUI = ({ inquiries, title }: AllMyInquiriesUIProps) => {

  const { formatDate } = useDateFormatter()

  const translateStatusToHebrew = (status: string) => {
    if (!status) return status;

    const normalized = status.toLowerCase();
    switch (normalized) {
      case 'rejected':
        return 'נדחתה';
      case 'in process':
        return 'בטיפול';
      case 'approved':
      case 'completed':
        return 'אושרה';
      case 'canceled':
        return 'בוטלה';
      default:
        return status;
    }
  }

  const translateTitleToHebrew = (title: string) => {
    if (!title) return title;

    const normalized = title.toLowerCase();
    switch (normalized) {
      case 'employment':
        return 'אישור העסקה';
      case 'embassy':
        return 'מכתב לשגרירות';
      case 'freefit':
        return 'FreeFit';
      case 'car':
        return 'אישור החזקת רכב';
      case 'cibus':
        return 'בקשה להנפקת סיבוס';
      case 'shoes':
        return 'בקשה לנעלי עבודה';
      default:
        return title;
    }
  }

  const getMessage = (inquiry: IInquiriesItem) => {
    const status = translateStatusToHebrew(inquiry.status);
    switch (status) {
      case 'בטיפול':
        return { type: 'inProgress', message: inquiry.formHandlingPeriod }
      case 'אושרה':
        return { type: 'done', message: "הטיפול הסתיים - הבקשה תועבר לארכיון תוך 7 ימים ממועד האישור" }
      case 'נדחתה':
        return { type: 'done', message: "הבקשה נדחתה, ותעבור לארכיון תוך 7 ימים ממועד הדחייה" }
      case 'בוטלה':
        return { type: 'done', message: "הבקשה בוטלה, ותעבור לארכיון תוך 7 ימים ממועד הביטול" }
      default:
        return { type: 'none', message: "" }
    }
  }

  const getStatusClass = (status: string) => {
    const translated = translateStatusToHebrew(status);
    switch (translated) {
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
    <div className={classes.allMyInquiriesContainer}>
      <h2 className={classes.allMyInquiriesTitle}>{title}</h2>
      {(inquiries && inquiries.length > 0) ?
        <>
          <table className={classes.inquiriesTable}>
            <thead className={classes.inquiriesThead}>
              <th>שם הטופס</th>
              <th>מועד הגשת הטופס</th>
              <th>תאריך עדכון אחרון</th>
              <th>סטטוס</th>
            </thead>
            <tbody className={classes.inquiriesTbody}>
              {inquiries.map((inquiry: IInquiriesItem) => {
                const { type, message } = getMessage(inquiry)
                return <React.Fragment>
                  <tr className={classes.mainTr} onClick={() => onRowClick(inquiry.link.Url)} aria-label={"יש ללחוץ על השורה על מנת לפתוח את הטופס"}>
                    <td className={(type === 'done' || type === 'inProgress') && classes.tdWithoutBorderBottom}>
                      <div>
                        {translateTitleToHebrew(inquiry.title)}
                      </div>
                    </td>
                    <td className={(type === 'done' || type === 'inProgress') && classes.tdWithoutBorderBottom}>{formatDate(inquiry.date)}</td>
                    <td className={(type === 'done' || type === 'inProgress') && classes.tdWithoutBorderBottom}>{formatDate(inquiry.lastModified)}</td>
                    <td className={(type === 'done' || type === 'inProgress') && classes.tdWithoutBorderBottom}><div className={classes.status + ' ' + getStatusClass(inquiry.status)}>{translateStatusToHebrew(inquiry.status)}</div></td>
                  </tr>
                  {inquiry.receiverName && (
                    <tr>
                      <td colSpan={5} className={classes.subTextInfoTd}>
                        <div className={classes.message + ' ' + classes.receiverMessage}>
                          <img src={InfoDarkIcon} alt="Info Icon" />
                          <span>ה-WOW עבור :  <b>{inquiry.receiverName}</b>
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr aria-hidden={type !== 'done' && type !== 'inProgress'}>
                    <td colSpan={5} className={classes.subTextTd}>
                      {type === 'done' && <div className={classes.message}>
                        <img src={InfoIcon} />
                        <span>{message}</span>
                      </div>}
                      {
                        type === 'inProgress' && (
                          <div className={classes.message + ' ' + classes.inProgressMessage}>
                            <img src={InfoDarkIcon} />
                            <div><b>בד"כ</b> מטופל תוך {message} ימי עסקים</div>
                          </div>)
                      }
                    </td>
                  </tr>
                </React.Fragment>
              })}
            </tbody>
          </table>
          <div className={classes.inquiriesCards}>
            {inquiries.map(inquiry => {
              const { message, type } = getMessage(inquiry);
              return <a className={classes.inquiryCardContainer} href={inquiry.link.Url} target={'_blank'}>
                <div className={classes.inquiryTitle}>{translateTitleToHebrew(inquiry.title)}</div>
                <table className={classes.mobileInquiryTable}>
                  <thead>
                    <th>מועד הבקשה</th>
                    <th>עדכון אחרון</th>
                    <th>סטטוס הבקשה</th>
                  </thead>
                  <tbody>
                    <td>{formatDate(inquiry.date)}</td>
                    <td>{formatDate(inquiry.lastModified)}</td>
                    <td><div className={classes.status + ' ' + getStatusClass(inquiry.status)}>{translateStatusToHebrew(inquiry.status)}</div></td>
                  </tbody>
                </table>
                {(type === "done" || type === "inProgress") &&
                  (<div className={classes.mobileInquiryNote}>
                    {type === "inProgress" ?
                      <div className={classes.message + ' ' + classes.inProgressMessage}>
                        <img src={InfoDarkIcon} />
                        <b>בד"כ</b> מטופל תוך {message} ימי עסקים
                      </div>
                      :
                      <div className={classes.message}>
                        <img src={InfoIcon} />
                        <span>{message}</span>
                      </div>}
                  </div>)}
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
export default AllMyInquiriesUI