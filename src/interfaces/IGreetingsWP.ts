import { GreetingCardListItemType, GreetingsLogListItemType} from "./Types";

export interface IGreetingsWP {
    Title:string,
    GreetingCardList:Array<GreetingCardListItemType>,
    GreetingList:Array<GreetingsLogListItemType>,
    SendGreetingTitle:string,
}