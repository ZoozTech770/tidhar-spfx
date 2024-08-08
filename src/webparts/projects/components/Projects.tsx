import * as React from 'react';
import { useEffect, useState } from 'react';
import { IProjectsProps } from './IProjectsProps';
import { ProjectsService } from '../../../services/ProjectsService';
import OurProjects from '../../../components/OurProjects/ourProjects';
import { IProjectListItem } from '../../../interfaces/IProjectListItem';

const Projects: React.FC<IProjectsProps> = (props) => {
  const {
    title,
    list,
    projectPageTitle,
    context
  } = props;

  const [projectsListAll, setProjectsListAll] = useState<IProjectListItem[]>([]);

  useEffect(() => {
    (async () => {
      const rawResponse = await ProjectsService.getProjects(context, list);
      setProjectsListAll(rawResponse);
    })();
  }, []);

  return (
    <OurProjects title={title} projectsListAll={projectsListAll} projectPageTitle={projectPageTitle}></OurProjects>
  );
}
export default Projects;