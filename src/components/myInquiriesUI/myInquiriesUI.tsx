import * as React from 'react';
import { IMyInquiries } from '../../interfaces/IMyInquiries';
import InquirieLine from './InquirieLine/inquirieLine';
import { translateTitleToHebrew } from '../../util/inquiriesMappings';
import classes from './myInquiriesUI.module.scss';

const MyInquiriesUI: React.FC<IMyInquiries> = (props) => {
  const {
    title,
    inquiries,
    allInquiries,
    newForm,
    showPendingApproval,
    allFormList
  } = props;

  return (
    <div className={`${classes.myInquiries} ${showPendingApproval ? classes.limited : classes.spacious}`}>
      <div className={classes.title}>{title} ({inquiries.length})</div>
      {inquiries.length > 0 ? <div className={classes.inquiriesList}>
        {inquiries.map(item =>
          <InquirieLine inquirie={item} showPendingApproval={showPendingApproval} />
        )}
      </div> : <div className={classes.noInquiries}>
        <p>אין לך פניות פעילות. אפשר לפתוח פניות מסוגים שונים בקלות ובמהירות ולייעל את תהליך העבודה. </p>
        <span className={classes.formSelection}>בחירת טופס למילוי</span>
        <div className={classes.allForms}>
          {allFormList?.map(form =>
             <a className={classes.form} href={form.link.Url}>{translateTitleToHebrew(form.title)}</a>
            )}
        </div>
      </div>}

      {newForm && <a href={newForm.Url} target={newForm.OpenURLInNewTab ? "_blank" : "_self"} className={classes.newForm} data-interception="off">{newForm.Text}</a>}
      {allInquiries && <a href={allInquiries.Url} target={allInquiries.OpenURLInNewTab ? "_blank" : "_self"} className={classes.allInquiries}>{allInquiries.Text}</a>}

    </div>
  );
}
export default MyInquiriesUI;