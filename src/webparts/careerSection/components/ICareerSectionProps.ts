import { IBringFriendsProps } from '../../bringFriends/components/IBringFriendsProps';
import { IProjectsProps } from '../../projects/components/IProjectsProps';
import { INewEmployeesProps } from '../../newEmployees/components/INewEmployeesProps';
import { IThanksProps } from '../../thanks/components/IThanksProps';

export interface ICareerSectionProps {
  title:string;
  projectsProps:IProjectsProps;
  bringFriendsProps:IBringFriendsProps;
  thanksProps:IThanksProps;
  newEmployeesProps:INewEmployeesProps;
}
