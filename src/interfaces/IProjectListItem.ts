import {LinkType, PictureType } from "./Types";

export interface IProjectListItem {
    Id:number;
    Title:string,
    Image?:PictureType,
    URL?:LinkType,
    URLNewTab:boolean,
    ProjectManager?:string,
    DescriptionAbbreviated?:string,
    Description?:Text
    ProjectType?:string,
    ProjectLat?:number,
    ProjectLng?:number,
    WazeAdress?:string,

}