import { LinkType ,IconType, ArticlesListItemType} from "./Types"

export interface IArticlesHome {
    Title: string,
    List:Array<ArticlesListItemType>,
    TitleIcon?:IconType,
    Url:LinkType
  }