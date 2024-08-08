import * as React from 'react';
import { ICareerSectionProps } from './ICareerSectionProps';
import Jobs from '../../jobs/components/Jobs';
import BringFriends from '../../bringFriends/components/BringFriends';
import Thanks from '../../thanks/components/Thanks';
import NewEmployees from '../../newEmployees/components/NewEmployees';
import "./CareerSection.scss";

const CareerSection = ({ title, jobsProps, bringFriendsProps, thanksProps, newEmployeesProps }: ICareerSectionProps) => {
  return (
    <div className='career-section' >
      <div className='career-section-wrapper'>
        <div className='career-title'>{title}</div>
        <div className='wrapper' >
          <div className='right-column' id={'jobs'}>
            <Jobs {...jobsProps} />
          </div>
          <div className='middle-column'>
            <div id={'bring_friends'}><BringFriends {...bringFriendsProps} /></div>
            <div id={'thanks'}><Thanks {...thanksProps} /></div>
          </div>
          <div className='left-column'>
            <div id={'new_employees'}><NewEmployees {...newEmployeesProps} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CareerSection