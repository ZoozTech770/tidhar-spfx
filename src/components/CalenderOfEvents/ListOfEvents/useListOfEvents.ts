import { useEffect, useState } from "react";
import { IEventsListItem } from "../../../interfaces/IEventListItem";
import useWindowSizeListener from "../../../util/useWindowSizeListener";


const useListOfEvents = (allListEvent: IEventsListItem[]) => {
    const [tabIndex, setTabIndex] = useState<number>(1);
    const [listEvents, setListEvent] = useState<IEventsListItem[]>([]);
    const [count, setCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const tabTitle = [{ id: 1, title: "הכל" }, { id: 2, title: "חגים ומועדים" }, { id: 3, title: "אירועים בתדהר" }, { id: 4, title: "ימים בינלאומיים" }, { id: 5, title: "מהלכים ארגוניים" }];
    const { isDesktopView } = useWindowSizeListener();
    const onSelectTab = (index: number) => {
        setTabIndex(index);
    }
    const onFilter = () => {
        let listHelp: IEventsListItem[] = [...allListEvent];
        if (tabIndex != 1) {
            let tag = tabTitle.filter(tag => tag.id == tabIndex)[0]?.title;
            listHelp = allListEvent.filter(event => event.Tag == tag);
        }        
        if (isDesktopView) {
            setListEvent(listHelp);
        }
        else {
            setCount(listHelp.length);
            listHelp.length > 6 ? setListEvent(listHelp.slice(0, 6 * currentPage)) : setListEvent(listHelp);
        }
    }

    const onShowMore = () => {
        setCurrentPage(currentPage + 1);
    }
    
    useEffect(() => {
        onFilter();
    }, []);

    useEffect(() => {
        onFilter();
    }, [tabIndex, currentPage, isDesktopView]);

    useEffect(() => {
        onFilter();
        setTabIndex(1);
        setCurrentPage(1);
    }, [allListEvent]);

    return {
        onSelectTab,
        tabIndex,
        listEvents,
        tabTitle,
        count,
        onShowMore,
        isDesktopView
    };
};

export default useListOfEvents;