import { LinkType } from "./Types";

type EventsListItemType ={
    Title:string,
    Date:Date,
    IsRegistred:boolean
}

export interface IEventsCalendarWP {
    Title:string,
    List:Array<EventsListItemType>,
    EventLink:LinkType,
    ToAllUrl:LinkType //todo
}