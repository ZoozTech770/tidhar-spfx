import * as React from 'react';
import { IJobsListItem } from '../../../interfaces/IJobsListItem';
import "./jobItem.scss";

const Jobsitem: React.FC<IJobsListItem> = (props) => {
  const {
    Title,
    jobDescription,
    HiringManager,
    Unit,
    PublishDate,
    Url
  } = props;

  return (
    <a href={Url ? Url.Url : "#"} target={Url ? Url.OpenURLInNewTab ? "_blank" : "_self" : "_self"} className='job-item' data-interception="off">
      <div className='job-title' title={Title}>{Title}</div>
      <div className='job-description' title={jobDescription}>{jobDescription}</div>
      <div className='job-info'>
        {HiringManager ? <span>{HiringManager} | </span> : null}
        {Unit ? <span>{Unit} | </span> : null}
        {PublishDate ? <span>{PublishDate.getDate()}/{PublishDate.getMonth() + 1}/{PublishDate.getFullYear()}</span> : null}
      </div>
    </a>
  );
}
export default Jobsitem;