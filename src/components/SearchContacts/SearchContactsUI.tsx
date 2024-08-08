import * as React from 'react';
import { useState, useRef } from 'react';
import { ISearchContacts } from '../../interfaces/ISearchContacts';
import "./searchContacts.scss";
const SearchContactsUI: React.FC<ISearchContacts> = (props) => {
  const {
    buttonText,
    placeHolder,
    resultPageUrl
  } = props;
  const [searchValue, setSearchValue] = useState('');

  const searchContact = (sender: any) => {
    if (sender.type == "click" || sender.keyCode === 13) {
      window.open(`${resultPageUrl}?k=${searchValue}`);
    }
  }
  const setValue = (e: any) => {
    setSearchValue(e.target.value)
  }

  const searchRef = useRef(null);

  return (
    <div className='search-wrapper'>
      <div className='search-container' ref={searchRef}>
        <div className='search-contacts-container' ref={searchRef}>
          <div className='search-contacts'>
            <input className='search' type="text" onKeyDown={searchContact} onChange={setValue} placeholder={placeHolder} value={searchValue} />
            <button type="button" className='button' onClick={searchContact}><span className='text'>{buttonText}</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SearchContactsUI;