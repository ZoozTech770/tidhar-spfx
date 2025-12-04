import * as React from 'react';
import ListOfEvents from './ListOfEvents/listOfEvents';
import CalenderEvents from './CalenderEvents/calenderEvents';
import { IEventsListItem } from '../../interfaces/IEventListItem';

type EventsContentProps = {
  tabIndex: number;
  listEvent: IEventsListItem[];
  calenderEvent: IEventsListItem[];
  onExportToExcel: Function;
  onMonthChange: Function;
  onCalendarYearChange: (year: number) => void;
};

const EventsContent: React.FC<EventsContentProps> = (props) => {
  const {
    tabIndex,
    listEvent,
    calenderEvent,
    onExportToExcel,
    onMonthChange,
    onCalendarYearChange,
  } = props;

  return (
    <div role="tabpanel">
      {tabIndex === 1 ? (
        <ListOfEvents allListEvent={listEvent} onExportToExcel={onExportToExcel} />
      ) : (
        <CalenderEvents
          onCalendarYearChange={onCalendarYearChange}
          listEvent={calenderEvent}
          onMonthChange={onMonthChange}
        />
      )}
    </div>
  );
};

export default EventsContent;
