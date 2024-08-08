import { useCallback, useState } from "react";
import { InputActionMeta, SingleValue } from "react-select";
import { IProjectListItem } from "../../../interfaces/IProjectListItem";
export interface IOption {
    id: string;
    label: string;
}
const useSearchProjects = (onSearch: Function,allProjects?: IProjectListItem[]) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    
    const options: IOption[] = [];
    allProjects?.forEach((project) => {
        options.push({id:project.Title, label:project.Title});
    });

    const handleInputChange = useCallback((searchText: string, actionMeta: InputActionMeta) => {
        if (actionMeta.action === 'input-change' || actionMeta.action === 'set-value') {
            setSearchTerm(searchText);
        }
    }, [setSearchTerm]);
    // on option selected from autocomplete list
    const onSelect = useCallback((selected: SingleValue<IOption>,) => {

        if (selected) {
            setSearchTerm(selected.label);
            onSearch(selected.label);
        }
    }, [onSearch, setSearchTerm,]);
    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.code) {
            case "Enter": {
                onSearch(searchTerm);
                // event.preventDefault();
                break;
            }
            default:
                break;
        }
    };
    const onClear = () => {
        setSearchTerm("");
        onSearch("");
    }
    const onBlurInput = () => {
        setTimeout(()=>{
            onSearch(searchTerm);
        },300)
    }
    return {
        options,
        searchTerm,
        handleInputChange,
        onSelect,
        handleKeyDown,
        onClear,
        onBlurInput
    }
}
export default useSearchProjects;