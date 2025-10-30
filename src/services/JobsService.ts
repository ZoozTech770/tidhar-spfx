import { ISPFXContext, SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import { IJobsListItem } from "../interfaces/IJobsListItem";

export default class jobsService {
 
  private createJobItem(item:any,jobPage:string):IJobsListItem{
     
    const res = {
      Title:item.Title,
      jobDescription:item.eldJobSummery,
      HiringManager:item.eldHiringManagerUser.Title,
      Unit:item.eldUnit,
      jobLocation:item.jobLocation,
      jobType:item.jobType,
      PublishDate:new Date(item.eldPublishDate),
      Url:{
        Text:item.eldURL?item.eldURL.Description:jobPage,
        Url:item.eldURL?item.eldURL.Url:`${jobPage}?PageID=${item.Id}`,
        OpenURLInNewTab:item.eldOpenURLInNewTab
      }
    };
    return res;
  }
  public async getJobs(context: ISPFXContext, listUrl: string,jobPage:string): Promise<IJobsListItem[]> {
    const sp = spfi().using(SPFx(context));
    let result:IJobsListItem[] = [];
    let now = new Date().toISOString();
    const items: any[] = await sp.web.getList(listUrl).items
                                     .select("*,eldHiringManagerUser/Title")
                                     .expand("eldHiringManagerUser")
                                     .filter(`(eldPublishDate le datetime'${now}' or eldPublishDate eq null) and eldJobStatus eq 'בתוקף'`)
                                     .orderBy("eldPublishDate",false)
                                     .top(5)();
                                     items.forEach(item=>
                                      result.push(this.createJobItem(item,jobPage))
                                      )                             
    return result;
  }

  public async getAllJobs(context: ISPFXContext, listUrl: string): Promise<IJobsListItem[]> {
    const sp = spfi().using(SPFx(context));
    let result:IJobsListItem[] = [];
    let now = new Date().toISOString();
    const items: any[] = await sp.web.getList(listUrl).items
                                     .select("*,eldHiringManagerUser/Title")
                                     .expand("eldHiringManagerUser")
                                     .filter(`(eldPublishDate le datetime'${now}' or eldPublishDate eq null) and eldJobStatus eq 'בתוקף'`)
                                     .orderBy("eldPublishDate",false)();
                                     items.forEach(item=>
                                      result.push(this.createJobItem(item,""))
                                      )                             
    return result;
  }
}
export const JobsService = new jobsService()
