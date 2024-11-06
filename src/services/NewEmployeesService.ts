import { ISPFXContext, SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/search";
import { ISearchQuery, SearchResults, SortDirection } from "@pnp/sp/search";
import { UserType } from "../interfaces/Types";
import { greetingLogItem } from "../types/TGreetingLogItem";
import { IItemAddResult } from "@pnp/sp/items";
import { format } from "date-fns";



export default class newEmployeesService {

  public async getGreetingCards(context: ISPFXContext, listUrl: string): Promise<any[]> {
    const sp = spfi().using(SPFx(context));
    let res: string[] = [];
    const tidharBday = "הצטרפו אלינו החודש";
    const items: any[] = await sp.web.getList(listUrl).items.select('*,eldGreetingType1/Title').expand('eldGreetingType1').filter(`eldGreetingType1/Title eq '${tidharBday}'`)();
    items.forEach(item => {
      res.push(item.eldGreetingCard.Url)
    });
    return res;
  }

  private creatUseritem(item: any) {
    const pictureUrl = `https://tidharconil.sharepoint.com/_layouts/15/userphoto.aspx?size=M&accountname=${item.eldUser.EMail}`;
    return {
      Name: item.Title,
      Role: item.JobTitle,
      Picture: { 
        UrlLaptop: pictureUrl, 
        Alt: item.Title 
      },
      Email: item.WorkEmail,
      EldDate: item.eldDate
    }

  }
  public async getNewEmployees(context: ISPFXContext, listUrl: string): Promise<any[]> {
    const sp = spfi().using(SPFx(context));
    let res: UserType[] = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const firstDayOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const todayFormatted = format(today, "yyyy-MM-dd");
    const firstDayOfCurrentMonthFormatted = format(firstDayOfCurrentMonth, "yyyy-MM-dd");

    const items = await sp.web
      .getList(listUrl)
      .items.select(
        "*,eldGreetingType1/Title,eldGreetingType1/eldDaysBeforeEvent,eldGreetingType1/eldDaysAfterEvent,eldUser/Title,eldUser/EMail,eldUser/Department,eldUser/JobTitle,eldUser/LastName,eldUser/Department"
      )
      .expand("eldUser,eldGreetingType1")
      .filter(`eldDate ge '${firstDayOfCurrentMonthFormatted}' and eldDate le '${todayFormatted}' and eldGreetingType1Id eq 2`)
      .orderBy("eldDate", true)();

    res = items.map(item => this.creatUseritem(item));
    return res;
  }

  public async addGreetingItem(context: ISPFXContext, listUrl: string, item: greetingLogItem) {
    const sp = spfi().using(SPFx(context));
    let temp: any = {
      Title: item.title,
      eldSender: item.sender,
      eldSenderEmail: item.senderEmail,
      eldReceiver: item.receiver,
      eldDate: item.date,
      eldGreetingCard: {
        Description: item.reetingCard,
        Url: item.reetingCard
      },
      eldGreetingContent: item.content
    }
    const res: IItemAddResult = await sp.web.getList(listUrl).items.add(temp);
    return res;
  }
}
export const NewEmployeesService = new newEmployeesService()