import * as React from 'react';
import { IProjectListItem } from '../../../interfaces/IProjectListItem';
import classes from './projectLine.module.scss';

type ProjectLineProps = {
    project: IProjectListItem,
    projectPageTitle:string
}
const ProjectLine: React.FC<ProjectLineProps> = (props) => {
    const { project,projectPageTitle } = props;
    const getTagClass = (): string => {
        switch (project.ProjectType) {
            case "ביצוע":
                return classes.orange;
            case "ייזום ומניבים":
                return classes.lightBlue;
            case "גמרים":
                return classes.pink;
            default:
                return "";
        }
    };
    return (
        <div className={classes.project}>
            <div className={classes.header}>
                <div className={classes.imgContiner}>
                    <img src={project.Image.UrlLaptop} alt={project.Image.Alt}>
                    </img>
                    <span className={classes.imgTitle}>{project.Title}</span>
                </div>
                <div>
                    <span className={classes.title}>{project.Title}</span>
                    <span className={`${classes.projectType} ${getTagClass()}`} >{project.ProjectType}</span>
                </div>
            </div>
            <p>
                {project.DescriptionAbbreviated}
            </p>
            <div className={classes.footer}>
                <div>
                    {project.URL ? <a href={project.URL?project.URL.Url:`#`} className={classes.link} target={project.URLNewTab ? "_blank" : "_self"} data-interception="off">{projectPageTitle}</a>:null}
                </div>
                <div className={classes.googleAndWase}>
                    {project.ProjectLat && project.ProjectLng && <a href={"https://www.google.com/maps/search/?api=1&query=" + project.ProjectLng + "," + project.ProjectLat} target={"_blank"} className={classes.google} data-interception="off"/>}
                    {project.ProjectLat && project.ProjectLng && <a href={"https://waze.com/ul?ll="+project.ProjectLng+","+project.ProjectLat} target={"_blank"} className={classes.wase} data-interception="off"/>}
                </div>
            </div>
        </div>
    );
}
export default ProjectLine;


