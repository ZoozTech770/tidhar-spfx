import * as React from 'react';
import { ISearchContactsProps } from './ISearchContactsProps';
import SearchContactsUI from '../../../components/SearchContacts/SearchContactsUI';
const SearchContacts: React.FC<ISearchContactsProps> = (props) => {
 
   return (
   <SearchContactsUI {...props}/>
  );
}
export default SearchContacts;
