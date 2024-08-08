import { IconType, LinkType } from "./Types"
import { IJobsListItem } from "./IJobsListItem"

export interface IJobsWP {
    Title:string,
    TitleIcon?:IconType,
    List:Array<IJobsListItem>,
    ToAllURL:LinkType
}