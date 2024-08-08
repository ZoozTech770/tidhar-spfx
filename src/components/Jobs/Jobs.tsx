import * as React from 'react';
import { IJobsWP } from '../../interfaces/IJobsWP';
import Jobsitem from './JobItem/JobItem';
import "./jobs.scss";
const JobsUI: React.FC<IJobsWP> = (props) => {
  const {
  Title,
  List,
  ToAllURL
  } = props;

  return (
    <div className='jobs-container'>
      <div className='jobs-title'> {Title}</div>
      <div className='jobs-wrapper'>
      <div className='jobs-items'>
      {List.map(item =>
        <Jobsitem {...item}/>
      )}
        </div>
      <div className='all-jobs-link'> <a href={ToAllURL.Url} target={ToAllURL.OpenURLInNewTab?"_blank":"_self"} data-interception="off">{ToAllURL.Text}</a></div>
      </div>
     
    </div>
  );
}
export default JobsUI;