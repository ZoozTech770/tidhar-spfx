import * as React from 'react';
import { IThanksProps } from './IThanksProps';
import {useState,useEffect} from 'react';
import {ThanksService} from '../../../services/ThanksService';
import ThanksUI from '../../../components/Thanks/thanks';
import { ThanksListItemType } from '../../../interfaces/Types';
const Thanks: React.FC<IThanksProps> = (props) => {
  const {
    title,
    list,
    toAllLinkTitle,
    toAllLinkUrl,
    toAllLinkNewTab,
    context
  } = props;
 
  const [thanksList, setThanksList] = useState<ThanksListItemType>(null);

     useEffect(() => {
       (async () => {
          const rawResponse = await ThanksService.getThanks(context,list);
          setThanksList(rawResponse);
       })();
     }, []);

  
  return (
    <ThanksUI Title={title} Item={thanksList} ToAllUrl={{Text:toAllLinkTitle,Url:toAllLinkUrl,OpenURLInNewTab:toAllLinkNewTab}}/>
  );
}
export default Thanks;

