import * as React from 'react';
import { useState, useEffect } from 'react';
import useCalenderOfEvents from './useCalenderOfEvents';
import classes from './calenderOfEvents.module.scss';
import ListOfEvents from './ListOfEvents/listOfEvents';
import { IEventsListItem } from '../../interfaces/IEventListItem';
import CalenderEvents from './CalenderEvents/calenderEvents';

type IEventsCalendarWP = {
    titleList: string,
    titleCalender: string,
    onMonthChange: Function,
    listEvent: IEventsListItem[],
    calenderEvent: IEventsListItem[],
    onExportToExcel: Function,
}
const CalenderOfEvents: React.FC<IEventsCalendarWP> = (props) => {
    const { titleList, titleCalender, onMonthChange, listEvent, calenderEvent, onExportToExcel } = props;
    const { onSelectTab, tabIndex } = useCalenderOfEvents();

    const [titleYear, setTitleYear] = useState<number>(new Date().getFullYear());
    const [listOfEventTitleYear, setListOfEventTitleYear] = useState<number>(new Date().getFullYear());

    const onCalendarYearChange = (year: number) => {
        setTitleYear(year);
    }

    useEffect(() => {
        setTitleYear(new Date().getFullYear());
    }, [tabIndex])

    useEffect(() => {
        const sortedList = listEvent.sort((a, b) => { return a?.Date?.getTime() - b?.Date?.getTime() })
        setListOfEventTitleYear(sortedList[0]?.Date?.getFullYear());
    }, [listEvent]);

    return (
        <div className={classes.calenderOfEvents} id={'events'}>
            <nav className={classes.tabsTitle} role="tablist">
                <button className={`${classes.title} ${tabIndex === 1 ? classes.tabActive : ""}`}
                    role="tab" aria-selected={1 === tabIndex} tabIndex={1 !== tabIndex ? -1 : 0}
                    onClick={() => onSelectTab(1)}>{titleList}</button>
                <button className={`${classes.title} ${tabIndex === 2 ? classes.tabActive : ""}`}
                    role="tab" aria-selected={2 === tabIndex} tabIndex={2 !== tabIndex ? -1 : 0}
                    onClick={() => onSelectTab(2)}>{titleCalender} {titleYear}</button>
            </nav>
            <div role="tabpanel">
                {tabIndex == 1 ? <ListOfEvents allListEvent={listEvent} onExportToExcel={onExportToExcel}></ListOfEvents> : <CalenderEvents onCalendarYearChange={onCalendarYearChange} listEvent={calenderEvent} onMonthChange={onMonthChange}></CalenderEvents>}
            </div>
        </div>
    );
}
export default CalenderOfEvents;


