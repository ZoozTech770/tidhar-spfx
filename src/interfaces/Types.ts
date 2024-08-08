
type LinkType = {
    Text?:string,
    Url:string
    OpenURLInNewTab?:boolean
}
type IconType = {
    UrlMobile?:string,
    UrlLaptop:string,
    Alt?:string
}
type pictureTest = {
    url:string,
    title:string
}
type PictureType = {
    UrlMobile?:string,
    UrlLaptop:string,
    Alt:string
}
type IconLinkType = {
    Icon?:IconType
    Url:string
    OpenURLInNewTab?:boolean
}
type ArticlesListItemType ={
    Title:string, 
    Picture:PictureType,
    Category?:string,
    URL?:IconLinkType,
    From?:string,
    Unit:string,
    PublishDate:Date
  } 
  type UserType = {
    Picture:PictureType,
    Name:string,
    Email:string,
    Role:string
}
type GreetingCardListItemType = {
    Title:string,
    EventType:string,
    GreetingCardUrl:string
}
type GreetingsLogListItemType = {
    Title:string,
    Sender:string,
    Receiver:string
    GreetingCard:string,
    Date:Date
}
type GreetingsListItemType = {
    User:UserType,
    EventType:string
}
type ThanksListItemType = {
    Image?:PictureType,
    SubTitle:string,
    URL?:LinkType
}

export {LinkType,IconType,PictureType,IconLinkType,ArticlesListItemType,UserType,GreetingCardListItemType,GreetingsLogListItemType,GreetingsListItemType,ThanksListItemType,pictureTest}
