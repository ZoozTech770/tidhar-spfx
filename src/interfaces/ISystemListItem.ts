import { IconType } from "./Types"

export interface SystemListItem {
    Id:number;
    Title:string,
    Url:string,
    OpenURLInNewTab:boolean,
    Order?:Int32Array,
    IsPermanent?:boolean,
    IsSelected?:boolean,
    IsActive?:boolean,
    Icon?:IconType,
}