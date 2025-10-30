import * as React from 'react';
import { IJobsListItem } from '../../../interfaces/IJobsListItem';
import "./jobItem.scss";

const Jobsitem: React.FC<IJobsListItem> = (props) => {
  const {
    Title,
    jobDescription,
    HiringManager,
    Unit,
    Url
  } = props;

  return (
    <a href={Url ? Url.Url : "#"} target={Url ? Url.OpenURLInNewTab ? "_blank" : "_self" : "_self"} className='job-item' data-interception="off">
      <div className='job-title' title={Title}>{Title}</div>
      <div className='job-description' title={jobDescription}>{jobDescription}</div>
      <div className='job-info'>
        {Unit ? <span>{Unit}</span> : null}
        {HiringManager && Unit ? <span> | </span> : null}
        {HiringManager ? <span>{HiringManager}</span> : null}
      </div>
    </a>
  );
}
export default Jobsitem;