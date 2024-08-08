import * as React from 'react';
import { useEffect, useState } from 'react';
import HeaderUI from '../../../components/HeaderUI/headerUI';
import { SystemListItem } from '../../../interfaces/ISystemListItem';
import {SystemsService} from  '../../../services/SystemsService';

interface ISystemsProps{
    context:any;
}
const Systems: React.FC<ISystemsProps> = (props) => {

 const {context} = props; 

  return (
    <HeaderUI context={context}/>
  );
}
export default Systems;