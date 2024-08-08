import { IconLinkType, LinkType } from "./Types"

type InquriesType = {
    Title:string,
    Status:string, //todo
    Url:IconLinkType,
    DaysLeft?:number
}

export interface IMyInquiriesWP {
    Title?:string,
    ItemsCounts:number,
    List?:Array<InquriesType>
    AddInquiriLink?:LinkType,//todo
    URL?:LinkType
}
