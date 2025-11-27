import * as React from 'react';
import classes from './inquirieLine.module.scss';
import { IInquiriesItem } from '../../../interfaces/IInquiriesItem';
import { translateTitleToHebrew } from '../../../util/inquiriesMappings';

type InquirieLineProps = {
    inquirie: IInquiriesItem;
    showPendingApproval:boolean,
}
const InquirieLine: React.FC<InquirieLineProps> = (props) => {
    const { inquirie,showPendingApproval } = props;
    const getTagClass = (): string => {
        switch (inquirie.status) {
            case "טיוטה":
                return classes.lightBlue;
            case "בוטלה":
                return classes.gray;
            case "נדחתה":
                return classes.red;
            case "אושרה":
                return classes.green;
            case "בטיפול":
                return classes.orange;
            default:
                return "";
        }
    };
    return (
        <a href={inquirie.link.Url} className={`${classes.inquirieLine} ${showPendingApproval ? classes.limited : classes.spacious}`}>
            <p className={classes.title} title={translateTitleToHebrew(inquirie.title)}>{translateTitleToHebrew(inquirie.title)}</p>
            <span className={`${classes.tag} ${getTagClass()}`}>{inquirie.status}</span>

        </a>
    );
}
export default InquirieLine;


