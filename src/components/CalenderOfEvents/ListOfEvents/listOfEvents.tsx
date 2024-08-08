import * as React from 'react';
import useListOfEvents from './useListOfEvents';
import classes from './listOfEvents.module.scss';
import { IEventsListItem } from '../../../interfaces/IEventListItem';
import EventLine from '../EventLine/eventLine';

type ListOfEventsProps = {
    allListEvent: IEventsListItem[];
    onExportToExcel: Function;
}
const ListOfEvents: React.FC<ListOfEventsProps> = (props) => {
    const { allListEvent, onExportToExcel } = props;
    const { tabIndex, onSelectTab, listEvents, tabTitle, count,
        onShowMore,
        isDesktopView } = useListOfEvents(allListEvent);
    const tabsTitle = tabTitle ? tabTitle.map((tab) => {
        return <button key={tab.title} className={`${classes.title} ${tab.id === tabIndex ? classes.tabActive : ""}`}
            role="tab" aria-selected={tab.id === tabIndex} tabIndex={tab.id !== tabIndex ? -1 : 0}
            onClick={() => onSelectTab(tab.id)}>{tab.title}</button>;
    }) : null;

    return (
        <div className={classes.listOfEvents}>
            <div className={classes.tabsTitleContiner}>
                <nav className={classes.tabsTitle} role="tablist" aria-label={"בחר"}>
                    {tabsTitle}
                </nav>
            </div>

            <div className={classes.events}>
                {listEvents.length > 0 ? listEvents?.map(event => {
                    return <EventLine event={event} showDate={true}></EventLine>
                }) : <div className={classes.noResult}>
                    אין תוצאות
                </div>}
                {!isDesktopView && count > listEvents.length && <button className={classes.btnShowMore} onClick={onShowMore}>הצג עוד ({count - listEvents.length})</button>}
            </div>
            <button className={classes.btnExportToExcel} onClick={() => onExportToExcel()}> ייצוא רשימת האירועים לקובץ אקסל</button>
        </div>
    );
}
export default ListOfEvents;


