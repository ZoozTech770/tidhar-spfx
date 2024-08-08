import { ISPFXContext, SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import { IEventsListItem } from "../interfaces/IEventListItem";

export default class eventsService {

  private async isRegistred(context: ISPFXContext, item: any, userEmail: string): Promise<boolean> {
    if (item.eldEventRegistrationList != null) {
      const sp = spfi().using(SPFx(context));
      let listUrl = item.eldEventRegistrationList.Url;
      var host = window.location.protocol + "//" + window.location.host;
      listUrl = listUrl.replace(host, "");
      try {
        const items: any[] = await sp.web.getList(listUrl).items
          .select('eldUserName/EMail')
          .expand('eldUserName')
          .filter(`eldUserName/EMail eq '${userEmail}'`)
          ();
        if (items != null && items.length > 0)
          return true;
        else
          return false;
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  private createEventsItem(item: any, eventPage: string): IEventsListItem {
    return {
      Title: item.Title,
      Date: new Date(item.eldDate),
      EndTime: new Date(item.eldEndTime),
      Tag: item.eldEventType,
      Location: item.eldLocation,
      Contact: item.eldContact,
      Unit: item.eldUnit,
      RegistrationLink: item.eldRegitrationLink ? { OpenURLInNewTab: true, Url: item.eldRegitrationLink.Url } : null,
      IsRegistered: item.isRegistred,
      CanRegistered: item.eldEventRegistrationList != null,
      Link: { Url: item.eldURL ? item.eldURL.Url : `${eventPage}?PageID=${item.Id}`, OpenURLInNewTab: item.eldOpenURLInNewTab }
    } as IEventsListItem;
  }

  public async getMonthlyEvents(context: ISPFXContext, listUrl: string, userEmail: string, eventPage: string, month?: number, year?: number): Promise<IEventsListItem[]> {
    const sp = spfi().using(SPFx(context));
    let date = new Date(), y = year ? year : date.getFullYear(), m = month != null ? month : date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);
    let res: IEventsListItem[] = [];
    let items: any[] = await sp.web.getList(listUrl).items
      .filter(`(eldDate ge datetime'${firstDay.toISOString()}' and eldDate le datetime'${lastDay.toISOString()}')`)// todo  and eldVisablity eq 1
      .orderBy("eldDate", false)();
    items = await this.fillIsRegisterd(context, items, userEmail);
    items.forEach((item: any) => {
      res.push(this.createEventsItem(item, eventPage));
    });
    return res;
  }

  public async getNext(context: ISPFXContext, items: any, userEmail: string, eventPage: string): Promise<IEventsListItem[]> {
    if (items.hasNext) {
      items = await items.getNext();
      items.results = await this.fillIsRegisterd(context, items.results, userEmail);
      return items;
    }
    return null;
  }

  private async fillIsRegisterd(context: ISPFXContext, items: any, userEmail: string) {
    await Promise.all(
      items.map(async (item: any) =>
        item["isRegistred"] = await this.isRegistred(context, item, userEmail)
      ));
    return items;
  }


  public async getUpcomingEvents(context: ISPFXContext, listUrl: string, userEmail: string, eventPage: string): Promise<IEventsListItem[]> {
    const sp = spfi().using(SPFx(context));
    let today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let res: IEventsListItem[] = [];
    let items: any = await sp.web.getList(listUrl).items
      //.select('title','eldDate','eldEndTime','eldEventType','eldLocation','eldEventRegistrationList','eldLink')
      .filter(`(eldDate ge datetime'${today.toISOString()}' or eldEndTime ge datetime'${today.toISOString()}')`)// todo  and eldVisablity eq 1
      .orderBy("eldDate", true)();
    items = await this.fillIsRegisterd(context, items, userEmail);
    items.forEach((item: any) => {
      res.push(this.createEventsItem(item, eventPage));
    });
    return res
  }
}
export const EventsService = new eventsService()
