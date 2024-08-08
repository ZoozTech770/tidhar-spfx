import { LinkType } from "./Types"

export interface IJobsListItem {
    Title:string,
    jobDescription:string,
    HiringManager:string,
    Unit?:string,
    PublishDate?:Date,
    Url:LinkType
}