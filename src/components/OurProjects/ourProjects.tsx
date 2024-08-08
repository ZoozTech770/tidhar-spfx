import * as React from 'react';
import { IProjectListItem } from '../../interfaces/IProjectListItem';
import classes from './ourProjects.module.scss';
import SearchProjects from './SearchProjects/searchProjects';
import useOurProjects from './useOurProjects';
import ProjectLine from './ProjectLine/projectLine';
import Pagination from '../Pagination';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from 'react';

type OurProjectsProps = {
    title: string,
    projectsListAll: IProjectListItem[],
    projectPageTitle:string
}
const OurProjects: React.FC<OurProjectsProps> = (props) => {
    const { title, projectsListAll,projectPageTitle } = props;
    const { currentPage, onPageUpdate, onsearch, searchTerm, isDesktopView, onScroolNext, projectsList, totalItems } = useOurProjects(projectsListAll);
    const [showProjectesDesktop, setShowProjectesDesktop] = useState<IProjectListItem[]>([]);
    const amountOfPages = totalItems % 2 == 0 ? totalItems / 2 : (totalItems / 2).toFixed();
    useEffect(() => {
        if (isDesktopView && projectsList) {
            currentPage == 1 ? setShowProjectesDesktop(projectsList) : setShowProjectesDesktop(showProjectesDesktop.concat(projectsList));
        }
    }, [projectsList]);


    return (
        <div className={classes.ourProjects} id={'our_projects'}>
            <h2 className={classes.title}>
                {title}
            </h2>
            <SearchProjects onSearch={onsearch} placeholder={"חיפוש פרויקט"} projectsListAll={projectsListAll}></SearchProjects>
            <div className={classes.projectListContainer}>
                {projectsList.length > 0 ? isDesktopView ?
                    <div id="scrollableDiv" className={classes.projectContainer}>
                        <InfiniteScroll
                            dataLength={showProjectesDesktop.length}
                            next={onScroolNext}
                            hasMore={showProjectesDesktop.length < totalItems}
                            loader={<h4>Loading...</h4>}
                            scrollableTarget="scrollableDiv"
                        >
                            {showProjectesDesktop.map((project, index) => (
                                <ProjectLine projectPageTitle={projectPageTitle} project={project}></ProjectLine>
                            ))}
                        </InfiniteScroll>
                    </div>
                    :
                    <Pagination initialPage={currentPage} onPageUpdate={onPageUpdate} amountOfPages={+amountOfPages}>
                        {projectsList?.map(project => {
                            return <ProjectLine projectPageTitle={projectPageTitle} project={project}></ProjectLine>
                        }
                        )}
                    </Pagination> : <div className={classes.noResult}>
                    לא נמצאו תוצאות.
                </div>}
            </div>

        </div>
    );
}
export default OurProjects;


