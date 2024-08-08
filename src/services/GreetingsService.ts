import { ISPFXContext, SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import { IItemAddResult } from "@pnp/sp/items";
import { greetingLogItem } from "../types/TGreetingLogItem";
import { IGreetingType } from "../interfaces/IGreetingType";
import { IGreetingItem } from "../interfaces/IGreetingItem";

export default class greetingsService {
    private birthday = "יום הולדת";
    private tidharBirthday = "תדהרולדת";
    public async getGreetingCards(context: ISPFXContext, listUrl: string, typeId: number): Promise<any[]> {
        const sp = spfi().using(SPFx(context));
        let res: string[] = [];
        const items: any[] = await sp.web.getList(listUrl).items.filter('eldGreetingType1 eq ' + typeId)();
        items.forEach(item => {
            res.push(item.eldGreetingCard.Url)
        });
        return res;
    }

    private createGreeatingTypeItem(item): IGreetingType {
        return {
            id: item.Id,
            text: item.Title,
            icon: { Alt: item.eldIcon.Description, UrlLaptop: item.eldIcon.Url }
        }
    }
    public async getGreetingTypes(context: ISPFXContext, listUrl: string): Promise<any[]> {
        const sp = spfi().using(SPFx(context));
        let res: IGreetingType[] = [];
        const items: any[] = await sp.web.getList(listUrl).items();
        items.forEach(item =>
            res.push(this.createGreeatingTypeItem(item)));
        return res;
    }

    private isValid(item: any) {
        if (item.eldGreetingType1.Title == this.birthday || item.eldGreetingType1.Title == this.tidharBirthday)
            return true;
        let today = new Date();
        let from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - item.eldGreetingType1.eldDaysBeforeEvent)
        let to = new Date(today.getFullYear(), today.getMonth(), today.getDate() + item.eldGreetingType1.eldDaysBeforeEvent)
        if (new Date(item.eldDate) >= from && new Date(item.eldDate) <= to)
            return true;
        return false;
    }

    private createGreetingItem(item): IGreetingItem {
        return {
            title: item.eldUser.Title,//item.eldUser.FirstName+" "+item.eldUser.LastName,
            date: new Date(item.eldDate),
            picture: { Alt: "", UrlLaptop: `https://tidharconil.sharepoint.com/_layouts/15/userphoto.aspx?size=M&accountname=${item.eldUser.EMail}` },
            greetingType: item.eldGreetingType1Id,
            role: item.eldUser.JobTitle ?? "",
            unit: item.eldUser.Department ?? "",
            maill: item.eldUser.EMail
        }
    }
    public async getGreetings(context: ISPFXContext, listUrl: string): Promise<any[]> {
        // 
        const sp = spfi().using(SPFx(context));
        let res = [];
        const currentYear = new Date().getFullYear();
        const firstDayOfYear = new Date(currentYear, 0, 1);
        const items: any[] = await sp.web.getList(listUrl).items
            .select('*,eldGreetingType1/Title,eldGreetingType1/eldDaysBeforeEvent,eldGreetingType1/eldDaysAfterEvent,eldUser/Title,eldUser/EMail,eldUser/Department,eldUser/JobTitle,eldUser/LastName,eldUser/Department')
            .expand("eldUser,eldGreetingType1")
            .filter(`(eldGreetingType1Id ne 2 or eldDate lt datetime'${firstDayOfYear.toISOString()}')`)
            .orderBy('eldGreetingType1/Title', true)();
        items.filter(item => {
            const today = new Date();
            const from = new Date().setDate(today.getDate() - 7);
            const date = this.getDateOfThisYear(item.eldDate);
            return this.isValid(item) && (date.getTime() > new Date(from).getTime() && date.getTime() <= today.getTime())
        }
        ).sort((a, b) => {
            const isATop = a.eldGreetingType1Id !== 1 && a.eldGreetingType1Id !== 2;
            const isBTop = b.eldGreetingType1Id !== 1 && b.eldGreetingType1Id !== 2;

            if ((isATop && isBTop) || (!isATop && !isBTop)) {
                if (a.eldDate < b.eldDate) return 1;
                if (a.eldDate > b.eldDate) return -1;
                return 0;
            }

            if (isATop && !isBTop) {
                return -1;
            }

            return 1;
        }).forEach(item =>
            res.push(this.createGreetingItem(item)));
        return res;
    }

    private getDateOfThisYear(dateString: string) {
        const today = new Date();
        const date = new Date(dateString);
        const month = date.getMonth();
        const day = date.getDate();
        const dateOfThisYear = new Date(today.getFullYear(), month, day);
        return dateOfThisYear
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
export const GreetingsService = new greetingsService()