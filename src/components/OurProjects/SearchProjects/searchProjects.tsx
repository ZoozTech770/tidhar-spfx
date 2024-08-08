import * as React from 'react';
import classes from './searchProjects.module.scss';
import Select, { components } from 'react-select';
import useSearchProjects from './useSearchProjects';
import { IProjectListItem } from '../../../interfaces/IProjectListItem';
import './reactSelectProjects.scss';
import { AutocompleteOption } from './AutocompleteOption/autocompleteOption';

type SearchProjectsProps = {
    onSearch: Function;
    placeholder?: string,
    projectsListAll: IProjectListItem[],
}
const SearchProjects: React.FC<SearchProjectsProps> = (props) => {
    const { onSearch, placeholder, projectsListAll } = props;
    const { options, searchTerm, handleInputChange, onSelect, handleKeyDown, onClear } = useSearchProjects(onSearch, projectsListAll);
    const NoOptionsMessage = (props: any) => {
        return (
            <components.NoOptionsMessage {...props}>
                <span>אין תוצאות</span>
            </components.NoOptionsMessage>
        );
    };
    return (
        <div className={classes.searchProjects}>
            <Select
                inputId="searchProjectsInput"
                onChange={(value) => onSelect(value)}
                inputValue={searchTerm}
                onInputChange={(value, action) => handleInputChange(value, action)}
                blurInputOnSelect
                closeMenuOnSelect
                placeholder={placeholder}
                aria-label={placeholder}
                components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                    SingleValue: () => null,
                    NoOptionsMessage,
                    Option: (props) => <AutocompleteOption searchTerm={searchTerm} props={props} />,
                }}
                classNamePrefix='react-select-search-projects'
                isMulti={false}
                options={options}
                isClearable={false}
                value={searchTerm ? { label: searchTerm, id: '' } : null}
                tabSelectsValue={false}
                onKeyDown={handleKeyDown}
            />
            {searchTerm.length > 0 ? <button onClick={onClear} className={classes.btnClear} aria-label='נקה חיפוש'></button> :
                <button aria-label='בצע חיפוש' className={classes.btnSearch} onClick={() => onSearch(searchTerm)}></button>}
        </div>
    );
}
export default SearchProjects;



