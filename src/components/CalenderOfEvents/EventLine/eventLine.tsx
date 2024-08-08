import * as React from 'react';
import { IEventsListItem } from '../../../interfaces/IEventListItem';
import classes from './eventLine.module.scss';
import { format } from 'date-fns';
import he from 'date-fns/locale/he';

type EventLineProps = {
    event: IEventsListItem;
    showDate?: boolean;
}
const EventLine: React.FC<EventLineProps> = (props) => {
    const { event, showDate } = props;
    const getTagClass = (): string => {
        switch (event.Tag) {
            case "חגים ומועדים":
                return classes.lightBlue;
            case "אירועים בתדהר":
                return classes.gray;
            case "ימים בינלאומיים":
                return classes.pink;
            case "מהלכים ארגוניים":
                return classes.yellowish;
            default:
                return "";
        }
    };
    return (
        <div className={classes.eventLine}>
            {showDate && <div className={classes.date}>
                <span className={classes.day}>
                    {format(event.Date, 'dd')}
                    {event.EndTime && event.Date.getTime() < event.EndTime.getTime()  && event.Date.getDate() != event.EndTime.getDate() && <span id="11">-{format(event.EndTime, 'dd')}</span>}
                </span>
                <span className={classes.month}>
                    {format(event.Date, 'MMM', { locale: he })}
                </span>
            </div>}
            <div className={classes.details}>
                <a className={classes.title} title={event.Title} href={(event.Tag !== "חגים ומועדים" && event.Tag !== "ימים בינלאומיים") && event.Link.Url} target={event.Link.OpenURLInNewTab ? "_blank" : "_self"} data-interception="off">
                    {event.Title}
                </a>
                <span className={` ${classes.tag} ${getTagClass()}`}>
                    {event.Tag}
                </span>
                <div className={classes.moreDetails}>
                    {((event.EndTime && event.Date.getDate() != event.EndTime.getDate() && event.Date.getHours() != 0) || (!event.EndTime && event.Date.getDate() == event.EndTime.getDate() && event.Date.getHours() != 0)) && <span className={classes.hour}> {format(event.Date, 'HH:mm')} </span>}
                    {(event.EndTime && event.Date.getDate() == event.EndTime.getDate()) && <span className={classes.hour}>{format(event.EndTime, 'HH:mm')} - {format(event.Date, 'HH:mm')}</span>}
                    {event.Location && <span className={classes.location}>{event.Location}</span>}
                </div>
                {event.IsRegistered && <span className={classes.isRegistered}>נרשמתי לאירוע</span>}
                {!event.IsRegistered && event.CanRegistered && event.RegistrationLink && <a href={event.RegistrationLink.Url} className={classes.btnRegistered} target='_blank' data-interception="off">להרשמה לאירוע</a>}
            </div>


        </div>
    );
}
export default EventLine;


