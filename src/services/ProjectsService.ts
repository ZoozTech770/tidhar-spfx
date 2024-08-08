import { ISPFXContext, SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import { IProjectListItem } from "../interfaces/IProjectListItem";

export default class projectsService {

  public async getNext(items:any): Promise<any>{
      if (items.hasNext) {
        items = await items.getNext();
        
      }
      return items;
  }

  private createProjectItem(item:any):IProjectListItem{
   return  { 
    Id:item.Id,
    Title: item.Title,
    Image:item.eldImage? { UrlLaptop: item.eldImage.Url, Alt: item.eldImage.Description }:null,
    DescriptionAbbreviated:item.eldDescription,
    ProjectLat: item.eldProjectLat,
    ProjectLng: item.eldProjectLng, 
    WazeAdress: item.eldWazeAdress,
    ProjectType: item.eldProjectType,
    URL:item.eldURL? { Text: item.eldURL.Description, Url: item.eldURL.Url } :null,
    URLNewTab:item.eldOpenURLInNewTab
   };
  }

  public async getProjects(context: ISPFXContext, listUrl: string): Promise<any> {
    const sp = spfi().using(SPFx(context));
    let res:IProjectListItem[]=[];
    const items: any = await sp.web.getList(listUrl).items
                                   .filter("eldActive eq 1" )
                                   .orderBy("Modified",false)();
    items.forEach((item:any) => {
      res.push(this.createProjectItem(item));
    });
    return res;
  }
}
export const ProjectsService = new projectsService()