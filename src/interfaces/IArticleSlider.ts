import { ArticlesListItemType } from "./Types";

export interface IArticleSlider {
  Title: string,
  List: Array<ArticlesListItemType>,
  SeveralItemsToDesplay: number,
  Several: number,
  SeveralSecondsBetweenArticles: number
}