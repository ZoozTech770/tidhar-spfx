import { useEffect, useState } from "react";

const usePagination = (amountOfPages: number, initialPage: number, onPageUpdate: Function) => {
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [isNextDisabled, setIsNextDisabled] = useState<boolean>(currentPage === 1);
    const [isPreviousDisabled, setIsPreviousDisabled] = useState<boolean>(currentPage === amountOfPages);
    const isDesktopView = window.screen.width > 430;

    const onNextPage = () => onGoToPage(currentPage + 1);
    const onPreviousPage = () => onGoToPage(currentPage - 1);

    const onGoToPage = (page: number) => {
        if (page < 1 || page > amountOfPages) {
            return;
        }

        setCurrentPage(page);
        onPageUpdate(page);
    };

    const pageNumbers = () => {
        let pageNumbers = [];
        let outOfRange = false;
        let neighbors = isDesktopView ? 2 : 1;
        let maxPagesToDisplay = isDesktopView ? 6 : 1;

        for (let i = 1; i <= amountOfPages; i++) {
            if (i === 1 || i === amountOfPages || Math.abs(i - currentPage) <= neighbors ||
            (currentPage < maxPagesToDisplay - (neighbors*2) && i < maxPagesToDisplay - 1) ||
            (currentPage - neighbors > amountOfPages - maxPagesToDisplay + 2 && i > amountOfPages - maxPagesToDisplay + 2) || 
            amountOfPages <= maxPagesToDisplay) {
                pageNumbers.push(i);
                outOfRange = false;
            } 
            // if (i == 0 || i == amountOfPages ||i==currentPage || currentPage-i <= neighbors && outOfRange) {
            //     pageNumbers.push(i);
            //     outOfRange = false;
            // }
            else {
                if (!outOfRange) {
                    pageNumbers.push(-1);
                }
                outOfRange = true;
            }
        }

        return pageNumbers;
    };

    useEffect(() => {
        setIsPreviousDisabled(currentPage === 1);
        setIsNextDisabled(currentPage === amountOfPages);
    }, [currentPage, amountOfPages]);

    useEffect(() => {
        setCurrentPage(initialPage);
    }, [initialPage]);

    return {
        currentPage,
        onGoToPage,
        onNextPage,
        onPreviousPage,
        isNextDisabled,
        isPreviousDisabled,
        pageNumbers
    };
};

export default usePagination;