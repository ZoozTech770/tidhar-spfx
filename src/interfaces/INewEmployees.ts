import { LinkType, UserType } from "./Types";

export interface INewEmployees {
    Title: string,
    getGreetingCards: Function,
    //GreetingCardList:Array<GreetingCardListItemType>,
    Users: Array<UserType>,
    autoPlayDelay: number,
    ToAllUrl: LinkType,
    onSendGreeting: Function,
}