import { IProjectListItem } from "./IProjectListItem"
import { IconType } from "./Types"

export interface IProjectsWP {
    Title:string
    List:Array<IProjectListItem>,
    TitleIcon?:IconType
}