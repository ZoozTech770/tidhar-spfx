import { LinkType } from "./Types"

export interface IJobsListItem {
    Title:string,
    jobDescription:string,
    HiringManager:string,
    Unit?:string,
    jobLocation?:string,
    jobType?:string,
    PublishDate?:Date,
    Url:LinkType
}
