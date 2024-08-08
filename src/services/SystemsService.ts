 import { ISPFXContext, SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import {SystemListItem} from '../interfaces/ISystemListItem';
import {SliderSystemListItem} from '../interfaces/ISliderSystemListItem';


export default class systemsService {

  public async getSystemsToSlider(context: ISPFXContext)
 {
  let systems:any[] = new Array<SliderSystemListItem>();
  let userSystems = await this.getUserSystems(context);
  let permanentSystems= await this.getSystemsForSlider(context,userSystems);
  permanentSystems.forEach( (system)=>{
  systems.push(this.createSystemItem(system,userSystems));
  });
  return systems;
 }

public async getSystemsForSlider(context: ISPFXContext,selectedSystems:any)
{
  let userSystems = selectedSystems!=null&&selectedSystems.length>0?selectedSystems[0].eldSystemId:[];
  const sp = spfi().using(SPFx(context));
  const nowISOString = new Date().toISOString();
  const permanentQuery = `<Eq><FieldRef Name="eldPermanentapp" /><Value Type="Boolean">1</Value></Eq>`;
  const query = {
    ViewXml: `<View><Query>
    <Where>
    <And>
    <Eq><FieldRef Name="eldActive" /><Value Type="Boolean">1</Value></Eq>
      <And>
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
         <Or>
         <IsNull><FieldRef Name='eldNewSystemExp' /></IsNull>
          <Geq>
          <FieldRef Name='eldNewSystemExp' />'
          <Value Type='DateTime' IncludeTimeValue='TRUE' StorageTZ='TRUE'>${nowISOString}</Value>
         </Geq>
         </Or>  
         </And> 
         ${
          userSystems.length>0?"<Or>"+this.getSelectedSystemsQuery(userSystems)+permanentQuery+"</Or>":permanentQuery
         }
        </And>   
        </And> 
    </Where>    
    <OrderBy>
      <FieldRef Name='eldOrder' Ascending='True' />
      <FieldRef Name='eldPermanentapp' Ascending='False' />
    </OrderBy>
  </Query></View>`
  }
  const items: any[] = await sp.web.lists.getByTitle('lstSystemList').getItemsByCAMLQuery(query);
  return items;
}

public getSelectedSystemsQuery(selectedSys:Array<number>)
{
  let query = "";
selectedSys.forEach(sys=>{
  let idQuery = `<Eq><FieldRef Name='ID' /><Value Type='Number'>${sys}</Value></Eq>`;
  query = query.length == 0?
  idQuery: `<Or>${idQuery}${query}</Or>`
})
return query;
}

public async getSystems(context: ISPFXContext)
{
  const [allSystems,userSystems] =await Promise.all([
    await this.getAllSystems(context),
    await this.getUserSystems(context)
  ])
  // let allSystems = await this.getAllSystems(context);
  // let userSystems = await this.getUserSystems(context);
  let systems:SystemListItem[] = new Array<SystemListItem>();
  allSystems.forEach( (system)=>{
      systems.push(this.createSystemItem(system,userSystems));
      });
  return systems;
}

// public createSystemItem(system: any,userSystems:any)
// {
//   let IsSelected = userSystems[0].eldSystemId.includes(system.ID) > -1;
//   let currSystem:SystemListItem = {Title:system.Title,Url:system.eldURL.Url,OpenURLInNewTab:system.eldOpenURLInNewTab,  Order:system.eldOrder,IsPermanent:system.eldPermanentapp,IsSelected:IsSelected,IsActive:system.IsActive};
//   return currSystem;
// }

public createSystemItem(system: any,userSystems:any)
{
  let IsSelected = userSystems.length>0&&userSystems[0].eldSystemId.includes(system.ID);
  let currSystem:SystemListItem ={ Id:system.Id,Title: system.Title, Url:system.eldURL?.Url, OpenURLInNewTab: system.eldOpenURLInNewTab, Order:system.eldOrder,IsPermanent:system.eldPermanentapp,IsSelected:IsSelected,IsActive:system.IsActive,Icon: { UrlLaptop: system.eldIcon.Url, Alt:system.eldIcon.Description } }
  return currSystem;
}


public async getAllSystems(context: ISPFXContext)
{
  const sp = spfi().using(SPFx(context));
  const nowISOString = new Date().toISOString();
  const query = {
    ViewXml: `<View><Query>
    <Where> 
    <And>
    <Eq><FieldRef Name="eldActive" /><Value Type="Boolean">1</Value></Eq>  
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
          <Or>
          <IsNull><FieldRef Name='eldNewSystemExp' /></IsNull>
           <Geq>
           <FieldRef Name='eldNewSystemExp' />'
           <Value Type='DateTime' IncludeTimeValue='TRUE' StorageTZ='TRUE'>${nowISOString}</Value>
          </Geq>
          </Or>
          </And>    
         </And>          
    </Where>
     <OrderBy>
        <FieldRef Name='eldPermanentapp' Ascending='False' />
        <FieldRef Name='eldOrder' Ascending='True' />
     </OrderBy>
  </Query></View>`,
  }
  const items: any[] = await sp.web.lists.getByTitle('lstSystemList').getItemsByCAMLQuery(query);
  return items;
}
public async getUserSystems(context: ISPFXContext)
{
  const sp = spfi().using(SPFx(context));
  const query = {
    ViewXml: `<View><Query>
    <Where> 
            <Eq>
             <FieldRef Name='Author'></FieldRef>
             <Value Type='User'><UserID/></Value>
            </Eq>    
    </Where>
  </Query></View>`,
  }
  const userSystems: any[] = await sp.web.lists.getByTitle('lstUserAppList').getItemsByCAMLQuery(query);
  return userSystems;
}

public async updateSelectedUserSystems(context: ISPFXContext,systems:number[]){
  let userSystems = await this.getUserSystems(context);
  if(userSystems && userSystems.length > 0)
  {
    return this.updateUserSystems(context,systems,userSystems[0].ID);
  }
  else{return this.addUserSystems(context,systems)}

}

public async updateUserSystems(context: ISPFXContext,systems:number[],itemId:number,){
  const sp = spfi().using(SPFx(context));
  return await sp.web.lists.getByTitle('lstUserAppList').items.getById(itemId).update({     
    eldSystemId: systems
  });
  
}

public async addUserSystems(context: ISPFXContext,systems:number[]){
  const sp = spfi().using(SPFx(context));
  return await sp.web.lists.getByTitle('lstUserAppList').items.add({   
    eldSystemId: systems 
  });
}
}

export const SystemsService = new systemsService();
