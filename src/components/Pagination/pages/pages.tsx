import classes from './pages.module.scss';
import usePagination from '../usePagination';
import * as React from 'react';

type PagesProps = {
    onPageUpdate: Function;
    amountOfPages: number;
    initialPage: number;
}
const Pages: React.FC<PagesProps> = (props) => {
    const { onPageUpdate, amountOfPages, initialPage }=props;
    const {
        currentPage,
        onNextPage,
        onPreviousPage,
        onGoToPage,
        isNextDisabled,
        isPreviousDisabled,
        pageNumbers,
    } = usePagination(amountOfPages, initialPage, onPageUpdate);

    return (
        <div className={classes.pagesNumberLayout}>
            {amountOfPages > 1 && <button className={classes.prev} onClick={onPreviousPage} disabled={isPreviousDisabled} aria-label='לעמוד הקודם'></button>}

            <ul className={classes.pageNumbers}>
                {pageNumbers().map((page, index) =>
                    <li key={index} className={`${classes.pageNumber} ${page === currentPage ? classes.current : ''}`}>
                        <button onClick={() => onGoToPage(page)} disabled={page === -1} aria-label={"מעבר לדף " + page}>{page === -1 ? '...' : page}</button>
                    </li>
                )}
            </ul>

            {amountOfPages > 1 && <button className={classes.next} onClick={onNextPage} disabled={isNextDisabled} aria-label='לעמוד הבא'></button>}
        </div>
    );
}
export default Pages;