import { ISPFXContext, SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import { ArticlesListItemType, IconLinkType, PictureType } from "../interfaces/Types";

export default class articlesService {
  public async getSliderData(context: ISPFXContext, listUrl: string,articlePage:string, itemsToDisplay?: number): Promise<ArticlesListItemType[]> {
 
    
    const sp = spfi().using(SPFx(context));
    const nowISOString = new Date().toISOString();
    const query = {
      ViewXml: `<View><Query>
      <Where>
        <And>     
           <Or>
             <IsNull><FieldRef Name='eldAudiences' /></IsNull>
            <Or>
             <Membership Type='CurrentUserGroups'><FieldRef Name='eldAudiences'/></Membership>
              <Eq>
               <FieldRef Name='eldAudiences'></FieldRef>
               <Value Type='User'><UserID/></Value>
              </Eq>
            </Or>
           </Or>
        <And>
        <Eq><FieldRef Name="eldDisplayOnSlider" /><Value Type="Boolean">1</Value></Eq>
        <And>
         <Or>
           <IsNull><FieldRef Name='eldPublish' /></IsNull>
           <Leq>
            <FieldRef Name='eldPublish' />'
            <Value Type='DateTime' IncludeTimeValue='TRUE' StorageTZ='TRUE'>${nowISOString}</Value>
          </Leq>
         </Or>
         <Or>
          <IsNull><FieldRef Name='eldExpired' /></IsNull>
            <Geq>
            <FieldRef Name='eldExpired' />'
            <Value Type='DateTime' IncludeTimeValue='TRUE' StorageTZ='TRUE'>${nowISOString}</Value>
           </Geq>
         </Or>
        </And>
        </And>
       </And>
      </Where>
    </Query></View>`,
    }
    const items: any[] = await sp.web.getList(listUrl).getItemsByCAMLQuery(query);
    items.forEach(item => {
      if (item.eldPublish != null) {
        let eldPublish = new Date(item.eldPublish);
        let Modified = new Date(item.Modified);
        item.sortedDate = eldPublish > Modified ? eldPublish : Modified;
      }
      else
        item.sortedDate = new Date(item.Modified);
    });
    let pinned = items.filter(item => item.eldPin).sort(function (a, b) {
      return b.sortedDate - a.sortedDate;
    });
    let notPinned = items.filter(item => !item.eldPin).sort(function (a, b) {
      return b.sortedDate - a.sortedDate;
    });
    let allArticles = pinned.concat(notPinned);
  
    if (itemsToDisplay != null)
      allArticles = allArticles.slice(0, itemsToDisplay);
      const arr: Array<ArticlesListItemType> = [];
      
      for (let i = 0; i < allArticles.length; i++) {
        const item=allArticles[i]
        const picture:PictureType= item.eldImage!=null ? {UrlLaptop: item.eldImage.Url ,UrlMobile: item.eldImage.Url,Alt: item.eldImage.Description} :null;
        const url:IconLinkType = {Url:item.eldURL!=null ? item.eldURL.Url:`${articlePage}?PageID=${item.Id}`,OpenURLInNewTab:item.eldOpenURLInNewTab} 
        arr.push({ Title:item.Title, 
          Picture: picture,
           Unit: item.eldUnit,
           URL:url,
           Category:item.eldCategory,
           From:item.eldFrom,
           PublishDate:item.eldPublish? new Date(item.eldPublish):new Date(item.Modified)})
      }
      return arr;
  }

  public async getData(context: ISPFXContext, listUrl: string,articlePage: string, itemsToDisplay?: number): Promise<ArticlesListItemType[]> {
    const sp = spfi().using(SPFx(context));
    const nowISOString = new Date().toISOString();
    const query = {
      ViewXml: `<View><Query>
      <Where>
        <And>     
           <Or>
             <IsNull><FieldRef Name='eldAudiences' /></IsNull>
            <Or>
             <Membership Type='CurrentUserGroups'><FieldRef Name='eldAudiences'/></Membership>
              <Eq>
               <FieldRef Name='eldAudiences'></FieldRef>
               <Value Type='User'><UserID/></Value>
              </Eq>
            </Or>
           </Or>
        <And>
        <Eq><FieldRef Name="eldDisplayOnHomePage" /><Value Type="Boolean">1</Value></Eq>
        <And>
         <Or>
           <IsNull><FieldRef Name='eldPublish' /></IsNull>
           <Leq>
            <FieldRef Name='eldPublish' />'
            <Value Type='DateTime' IncludeTimeValue='TRUE' StorageTZ='TRUE'>${nowISOString}</Value>
          </Leq>
         </Or>
         <Or>
          <IsNull><FieldRef Name='eldExpired' /></IsNull>
            <Geq>
            <FieldRef Name='eldExpired' />'
            <Value Type='DateTime' IncludeTimeValue='TRUE' StorageTZ='TRUE'>${nowISOString}</Value>
           </Geq>
         </Or>
        </And>
        </And>
       </And>
      </Where>
    </Query></View>`,
    }
    const items: any[] = await sp.web.getList(listUrl).getItemsByCAMLQuery(query);
    items.forEach(item => {
      if (item.eldPublish != null) {
        let eldPublish = new Date(item.eldPublish);
        let Modified = new Date(item.Modified);
        item.sortedDate = eldPublish > Modified ? eldPublish : Modified;
      }
      else
        item.sortedDate = new Date(item.Modified);
    });
    let pinned = items.filter(item => item.eldPin).sort(function (a, b) {
      return b.sortedDate - a.sortedDate;
    });
    let notPinned = items.filter(item => !item.eldPin).sort(function (a, b) {
      return b.sortedDate - a.sortedDate;
    });
    let allArticles = pinned.concat(notPinned);
    if (itemsToDisplay != null)
      allArticles = allArticles.slice(0, itemsToDisplay);
      
    const arr: Array<ArticlesListItemType> = [];
    for (let i = 0; i < allArticles.length; i++) {
      const item=allArticles[i];
      const picture:PictureType= item.eldImage!=null ? {UrlLaptop: item.eldImage.Url ,UrlMobile: item.eldImage.Url,Alt: item.eldImage.Description} :null;
      const url:IconLinkType = {Url:item.eldURL!=null ? item.eldURL.Url:`${articlePage}?PageID=${item.Id}`,OpenURLInNewTab:item.eldOpenURLInNewTab} 
      arr.push({ 
          Title:item.Title,
          Picture: picture,
          Unit: item.eldUnit,
          URL:url,
          Category:item.eldCategory,
          From:item.eldFrom,
          PublishDate: item.eldPublish?new Date(item.eldPublish):new Date(item.Modified)
        })
    }
    return arr;
    
  }
}
export const ArticlesService = new articlesService()
