import { ISPFXContext, SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/search";
import { ISearchQuery, SearchResults, SortDirection } from "@pnp/sp/search";
import { UserType } from "../interfaces/Types";
import { greetingLogItem } from "../types/TGreetingLogItem";
import { IItemAddResult } from "@pnp/sp/items";



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
    return {
      Name: item.Title,
      Role: item.JobTitle,
      Picture: { UrlLaptop: `https://tidharconil.sharepoint.com/_layouts/15/userphoto.aspx?size=M&accountname=${item.WorkEmail}`, Alt: item.Title },
      Email: item.WorkEmail
    }

  }
  public async getNewEmployees(context: ISPFXContext, rangeOfDays: number): Promise<any[]> {
    const sp = spfi().using(SPFx(context));
    let res: UserType[] = [];
    let today = new Date();
    let from = new Date().setDate(today.getDate() - rangeOfDays);
    const results: SearchResults = await sp.search(<ISearchQuery>{
      Querytext: `eldHireDate > ${new Date(from).toISOString()} AND eldHireDate < ${today.toISOString()}`,
      SourceId: 'B09A7990-05EA-4AF9-81EF-EDFAB16C4E31',
      SortList: [{ Property: 'eldHireDate', Direction: SortDirection.Descending }],
      SelectProperties: ['Title', 'eldHireDate', 'PictureURL', 'JobTitle', 'WorkEmail'],
      RowLimit: 100
    })
    const items: any[] = results.PrimarySearchResults;
    items.forEach(item =>
      res.push(this.creatUseritem(item))
    );

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