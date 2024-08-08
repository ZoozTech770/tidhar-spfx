import { useState } from "react";

const useCalenderOfEvents = () => {
    const [tabIndex, setTabIndex] = useState<number>(1);
    const onSelectTab = (index: number) => {
        setTabIndex(index);
    }
    return {
        onSelectTab,
        tabIndex
    };
};

export default useCalenderOfEvents;