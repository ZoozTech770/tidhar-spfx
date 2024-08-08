import { PictureType } from "./Types";

export interface IGreetingItem {
    title:string,
    picture:PictureType,
    date:Date,
    greetingType:number,
    role?:string,
    unit?:string,
    maill?:string,
}