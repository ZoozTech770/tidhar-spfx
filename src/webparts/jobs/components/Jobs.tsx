import * as React from 'react';
import { IJobsProps } from './IJobsProps';
import {useState,useEffect} from 'react';
import {JobsService} from '../../../services/JobsService';
import JobsUI from '../../../components/Jobs/Jobs';
import { IJobsListItem } from '../../../interfaces/IJobsListItem';
const Jobs: React.FC<IJobsProps> = (props) => {
  const {
    title,
    list,
    toAllLinkTitle,
    toAllLinkUrl,
    toAllLinkNewTab,
    jobPage,
    context
  } = props;
 
  const [jobsList,setJobsList] = useState<IJobsListItem[]>([]);

     useEffect(() => {
       (async () => {
          const rawResponse = await JobsService.getJobs(context,list,jobPage);
          setJobsList(rawResponse);
       })();
     }, []);

  
  return (
   <JobsUI 
     Title={title}
     List={jobsList}
     ToAllURL={{
     Text:toAllLinkTitle,
     Url:toAllLinkUrl,
     OpenURLInNewTab:toAllLinkNewTab
   }
   
   }
   />
  );
}
export default Jobs;
