import * as React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import classes from './calenderEvents.module.scss';
import './datePickerEvent.scss';
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import he from 'date-fns/locale/he';
registerLocale('he', he);
import { subDays } from "date-fns";
import { IEventsListItem } from '../../../interfaces/IEventListItem';
import { useEffect, useState } from 'react';
import EventLine from '../EventLine/eventLine';
import { format } from 'date-fns';

type CalenderEventsProps = {
    listEvent: IEventsListItem[];
    onMonthChange: Function;
    onCalendarYearChange: Function;
}
const CalenderEvents: React.FC<CalenderEventsProps> = (props) => {
    const { listEvent, onMonthChange, onCalendarYearChange } = props;
    const [eventsInSelectDay, setEventsInSelectDay] = useState<IEventsListItem[]>([]);
    const [selectDate, setSelectDate] = useState<Date | null>(null);
    const [prevMonth, setPrevMonth] = useState<string>("");
    const [nextMonth, setNextMonth] = useState<string>("");
    const onSelectDate = (date: Date) => {
        setSelectDate(date);
        let listHelp = listEvent.filter(event => event.Date.getDate() == date.getDate());
        setEventsInSelectDay(listHelp);
    }
    let highlightEvent = [];

    for (let index = 0; index < listEvent.length; index++) {
        highlightEvent.push(subDays(new Date(`${listEvent[index].Date}`), 0));
    }
    let highlightSelected = [];
    for (let index = 0; index < listEvent.length; index++) {
        if (listEvent[index].IsRegistered) {
            highlightSelected.push(subDays(new Date(`${listEvent[index].Date}`), 0));
        }

    }

    const highlightDatesAndClass = [
        {
            "react-datepicker__day--highlighted-custom-1": highlightEvent
        },
        {
            "react-datepicker__day--highlighted-custom-2": highlightSelected
        },
    ];
    const onSelectMonth = (date: Date) => {
        onMonthChange(date.getMonth(), date.getFullYear());
        date && setPrevMonth(format(new Date().setMonth((date.getMonth() - 1)), 'MMMM', { locale: he }));
        date && setNextMonth(format(new Date().setMonth((date.getMonth() + 1)), 'MMMM', { locale: he }));
        onCalendarYearChange(date.getFullYear());
    }
    useEffect(() => {
        setPrevMonth(format(new Date().setMonth((new Date().getMonth() - 1)), 'MMMM', { locale: he }));
        setNextMonth(format(new Date().setMonth((new Date().getMonth() + 1)), 'MMMM', { locale: he }));
    }, [])
    return (
        <div className={classes.calenderContainer}>
            <DatePicker
                onChange={(date) => onSelectDate(date)}
                locale="he"
                calendarClassName="react-datepicker-events"
                highlightDates={highlightDatesAndClass}
                selected={selectDate}
                dateFormatCalendar="MMMM"
                nextMonthButtonLabel={nextMonth}
                nextMonthAriaLabel='לחודש הבא'
                previousMonthAriaLabel='לחודש הקודם'
                previousMonthButtonLabel={prevMonth}
                onMonthChange={(month) => onSelectMonth(month)}
                showWeekNumbers={true}
                dateFormat="dd/MM/yyyy"
            ></DatePicker>
            <div className={classes.events}>
                {eventsInSelectDay && eventsInSelectDay.length > 0 ? eventsInSelectDay.map(event => {
                    return <EventLine event={event} showDate={false}></EventLine>
                }) : selectDate && <p>
                    אין אירועים ביום הנבחר</p>}
            </div>
        </div>
    );
}
export default CalenderEvents;


