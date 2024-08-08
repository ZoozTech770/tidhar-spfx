import * as React from 'react';
import Pages from './pages/pages';
import classes from './pagination.module.scss';

type PaginationProps = {
    onPageUpdate: Function;
    amountOfPages: number;
    initialPage: number;
}
const Pagination: React.FC<PaginationProps> = (props) => {
    const { onPageUpdate, amountOfPages,  initialPage, children } = props;

    return (
          <div className={classes.pagination}>

            {children}

            {amountOfPages > 1 && <Pages amountOfPages={amountOfPages} initialPage={initialPage} onPageUpdate={onPageUpdate} />}
        </div>
    );
}
export default Pagination;


