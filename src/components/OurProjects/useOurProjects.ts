import { useEffect, useState } from "react";
import { IProjectListItem } from "../../interfaces/IProjectListItem";

const useOurProjects = (projectsListAll: IProjectListItem[]) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [projectsList, setProjectsList] = useState<IProjectListItem[]>([]);
    const [totalItems,setTotalItems]=useState<number>(0);
    const isDesktopView = window.screen.width > 430;
    const onsearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    }

    const onPageUpdate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        onUpdateList(searchTerm, pageNumber, isDesktopView ? 5 : 2);
    }
    const onScroolNext = () => {
        onPageUpdate(currentPage + 1);
    }
    useEffect(() => {
        setCurrentPage(1);
        onPageUpdate(1);
    }, [searchTerm,projectsListAll]);

    const onUpdateList = async (searchTerm: string, currentPage: number, itemsPerPage: number) => {
        let startIndex = (currentPage - 1) * itemsPerPage;
          let help =[]; 
          if(searchTerm && searchTerm!=""){
            help=projectsListAll.filter(item=>item.Title.indexOf(searchTerm)>-1);
          } 
          else{
            help=projectsListAll.map(item => { return item });
          }
          setTotalItems(help.length);
          setProjectsList(help.splice(startIndex, itemsPerPage));
      }


    return {
        onPageUpdate,
        onsearch,
        searchTerm,
        currentPage,
        isDesktopView,
        onScroolNext,
        projectsList,
        totalItems
    };
};

export default useOurProjects;