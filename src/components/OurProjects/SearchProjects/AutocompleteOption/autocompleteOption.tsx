import * as React from 'react';
import { components } from 'react-select';
import classes from './autocompleteOption.module.scss';

type AutocompleteOptionProps = {
    props: any;
    searchTerm: string;
};
export const AutocompleteOption: React.FC<AutocompleteOptionProps> = ({props, searchTerm}) => {
    const splitSearchTerm = (title: string, term: string): string[] => {
        if (!term || !title) return [title];

        const santiziedSearchTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(santiziedSearchTerm, "i");
        const splittedOption = title.split(regex);
        const splittedWithSearchTerm = splittedOption.map((e: string, i: number) =>
            i < splittedOption.length - 1 ? [e, term] : [e]).reduce((a, b) => a.concat(b));

        return splittedWithSearchTerm;
    };

    return (
        <components.Option {...props}>
            <div>{splitSearchTerm(props.data.label, searchTerm).map((x: string, index: number) => {
                if (x.toLocaleLowerCase() === searchTerm.toLocaleLowerCase()) {
                    return <span key={index} className={classes.bold}><b>{x}</b></span>
                } else {
                    return x
                }
            })}</div>
            {props.data.subLabel && <div>{props.data.subLabel}</div>}
        </components.Option>
    );
};
 