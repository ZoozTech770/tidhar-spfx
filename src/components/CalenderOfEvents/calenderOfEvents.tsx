import * as React from 'react';
import { useState, useEffect } from 'react';
import useCalenderOfEvents from './useCalenderOfEvents';
import classes from './calenderOfEvents.module.scss';
import { IEventsListItem } from '../../interfaces/IEventListItem';
import EventsTabsHeader from './EventsTabsHeader';
import EventsContent from './EventsContent';

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
            <EventsTabsHeader
                titleList={titleList}
                titleCalender={titleCalender}
                titleYear={titleYear}
                tabIndex={tabIndex}
                onSelectTab={onSelectTab}
            />
            <EventsContent
                tabIndex={tabIndex}
                listEvent={listEvent}
                calenderEvent={calenderEvent}
                onExportToExcel={onExportToExcel}
                onMonthChange={onMonthChange}
                onCalendarYearChange={onCalendarYearChange}
            />
        </div>
    );
}
export default CalenderOfEvents;

