import { IProjectsProps } from '../../projects/components/IProjectsProps';

export interface IEventsProps {
  list:string;
  userEmail:string;
  eventPage:string;
  context:any;
  projectsProps?: IProjectsProps;
}
