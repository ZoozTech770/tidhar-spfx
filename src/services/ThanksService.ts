import { ISPFXContext, SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import { ThanksListItemType } from "../interfaces/Types";

export default class thanksService {

  public async getThanks(context: ISPFXContext, listUrl: string): Promise<ThanksListItemType> {
    const sp = spfi().using(SPFx(context));
    let res:ThanksListItemType =null;
    const items: any[] = await sp.web.getList(listUrl).items
                                     .orderBy("eldDate",false)
                                     .top(1)();
    if(items.length>0)
      res = {
      SubTitle:items[0].eldSubTitle,
      Image:items[0].eldImage?{UrlLaptop:items[0].eldImage.Url,Alt:items[0].eldImage.Description}:null,
      URL:items[0].eldURL?{Url:items[0].eldURL.Url}:null
      };
    return res;
  }
}
export const ThanksService = new thanksService()
