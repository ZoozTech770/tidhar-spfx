import { IBringFriendsProps } from '../../bringFriends/components/IBringFriendsProps';
import {IJobsProps} from '../../jobs/components/IJobsProps';
import { INewEmployeesProps } from '../../newEmployees/components/INewEmployeesProps';
import { IThanksProps } from '../../thanks/components/IThanksProps';

export interface ICareerSectionProps {
  title:string;
  jobsProps:IJobsProps;
  bringFriendsProps:IBringFriendsProps;
  thanksProps:IThanksProps;
  newEmployeesProps:INewEmployeesProps;
}
