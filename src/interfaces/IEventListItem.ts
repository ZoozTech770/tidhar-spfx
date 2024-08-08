import { LinkType } from "./Types"

export interface IEventsListItem {
    Title:string,
    Date:Date,
    EndTime?:Date,
    Link?:LinkType,
    Location?:string,
    // Image?:PictureType,
    Unit?:string,
    Contact?:string,
    EventDescription?:Text,
    IsRegistered?:boolean,
    Tag?:string,
    CanRegistered?:boolean,
    RegistrationLink?:LinkType
}