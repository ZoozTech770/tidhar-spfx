import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
// import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
// import { Dialog } from '@microsoft/sp-dialog';

// import * as strings from 'UserNameExtApplicationCustomizerStrings';

// const LOG_SOURCE: string = 'UserNameExtApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IUserNameExtApplicationCustomizerProperties {
  // This is an example; replace with your own property
  ListURL: string;
}

class WelcomeDate {
  eldStartTime: Date;
  eldStartDate: Date;
  eldEndTime: Date;
  eldEndDate: Date;
  LinkTitle: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class UserNameExtApplicationCustomizer
  extends BaseApplicationCustomizer<IUserNameExtApplicationCustomizerProperties> {

    public createWelcomeDate(item: any) {
      return {
        eldStartTime : new Date(new Date().setHours(new Date(item.eldStartTime).getHours(),new Date(item.eldStartTime).getMinutes())),
        eldEndTime : new Date(new Date().setHours(new Date(item.eldEndTime).getHours(),new Date(item.eldEndTime).getMinutes())),
        eldStartDate : new Date(item.eldStartDate),
        eldEndDate : new Date(item.eldEndDate),
        LinkTitle : item.Title
      }
    }

    public async getListItems() {
      const sp = spfi().using(SPFx(this.context));
      // const sp = spfi("https://tidharconil.sharepoint.com/sites/eladtest/Lists/lstWelcomeDateList/AllItems.aspx").using(SPFx(this.context));
      const items: any[] = (await sp.web.lists.getByTitle("lstWelcomeDateList").items()).map(
        item => this.createWelcomeDate(item)
      );
      return (items);
    }

  public async onInit(): Promise<void> {
    let text: string = "";
    const itemsList: WelcomeDate[] = await this.getListItems();
    itemsList.forEach(element => {
      if (new Date() >= element.eldStartDate && new Date() <= element.eldEndDate)
        if (new Date() >= element.eldStartTime && new Date() <= element.eldEndTime)
          text = element.LinkTitle
    });
    if (text == "") {
      itemsList.forEach(element => {
        if (new Date() >= element.eldStartTime && new Date() <= element.eldEndTime)
          text = element.LinkTitle
      });
    }
    const userName: string = this.context.pageContext.user.displayName;
    let firstName: string = "";
    if((userName.split(" ")).length > 0){
      firstName = (userName.split(" "))[0];
    }
    const div = document.getElementById("O365_HeaderRightRegion")as HTMLElement;
    const box = document.createElement("div");
    box.innerHTML = text +" "+ firstName;
    div.prepend(box);
    let name = document.getElementById('CenterRegion') as HTMLElement;
    name?.style.setProperty('width', 'calc(100% - 300px)');

    return Promise.resolve();
  }
}
