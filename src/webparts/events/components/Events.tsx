import * as React from 'react';
import { useState, useEffect } from 'react';
import { IEventsProps } from './IEventsProps';
import { EventsService } from '../../../services/EventsService';
import CalenderOfEvents from '../../../components/CalenderOfEvents/calenderOfEvents';

 export  type csvItem = {
  title:string;
  date:string;
  startHour:string;
  endHour:string;
  location:string;
  type:string;
  departemnt:string;
  contactEmail:string;
}
const Events: React.FC<IEventsProps> = (props) => {
  const {
    context,
    userEmail,
    eventPage,
    list
  } = props;
 
  const [eventList, setEventList] = useState<any[]>([]);
  const [monthyEventList, setMonthyEventList] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const rawResponse = await EventsService.getUpcomingEvents(context, list, userEmail,eventPage);
       setEventList(eventList.concat(rawResponse));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const rawResponse = await EventsService.getMonthlyEvents(context, list, userEmail,eventPage);
      setMonthyEventList(rawResponse);
    })();
  }, []);

  const onMonthChange = async (month: number ,year:number) => {
    const rawResponse = await EventsService.getMonthlyEvents(context, list, userEmail,eventPage, month, year);
    setMonthyEventList(rawResponse);
  }
  
  const onExportToExcel=()=>{
    let csvData :any[]=[];
    eventList.forEach(event=>
      csvData.push(
        {
          title:event.Title,
          date:event.Date.toLocaleDateString(),
          startHour:event.Date.toLocaleTimeString().substring(0, event.Date.toLocaleTimeString().length -3),
          endHour:event.EndTime.toLocaleTimeString().substring(0, event.EndTime.toLocaleTimeString().length -3),
          location:event.Location,
          type:event.Tag,
          departemnt:event.Unit,
          contactEmail:event.Contact,
        }
      )
      );
    var fields = Object.keys(csvData[0])
    var replacer = function(key:string, value:string) { return value === null ? '' : value } 
    var csv = csvData.map(function(row){
        return fields.map(function(fieldName){
           return JSON.stringify(row[fieldName], replacer)
   }).join(',')
    })
    let hebrewFields =["שם האירוע","תאריך האירוע","שעת התחלה","שעת סיום","מיקום","סוג אירוע","מחלקה","יצירת קשר"]
    csv.unshift(hebrewFields.join(',')) // add header column
    let csv2 = csv.join('\r\n');
    var a = document.createElement('a'); 
    a.textContent='download';
    a.download="upcomingEvents.csv";
    a.href='data:text/csv;charset=utf-8,%EF%BB%BF'+encodeURIComponent(csv2);
    a.click();
  }
  return (
      <CalenderOfEvents titleList={"לוח אירועים"} titleCalender={"לוח שנה"} onMonthChange={onMonthChange} listEvent={eventList} calenderEvent={monthyEventList} onExportToExcel={onExportToExcel}></CalenderOfEvents>
)
}
export default Events;

