import * as React from 'react';
import { IGreetingItem } from '../../../interfaces/IGreetingItem';
import classes from './greetingItem.module.scss';
import { format } from 'date-fns';
import { IGreetingType } from '../../../interfaces/IGreetingType';

type IGreetingsProps = {
    item: IGreetingItem;
    greetingTypeList: IGreetingType[],
    onOpenModel:Function,
}
const GreetingItem: React.FC<IGreetingsProps> = (props) => {
    const { item,greetingTypeList,onOpenModel } = props;
    const greetingType=greetingTypeList.filter(type=>type.id==item.greetingType)[0];
    return (
        <div className={classes.greeting}>
            <img className={classes.personImg} alt={item.picture.Alt} src={item.picture.UrlLaptop}></img>
            <span title={item.title}>{item.title}</span>
            <span title={greetingType.text} className={classes.bold}>{greetingType.text}</span>
            <img className={classes.greetingIcon} alt={greetingType.icon.Alt} src={greetingType.icon.UrlLaptop}></img>
            <span>{format(item.date, 'dd.MM')}</span>
            <span title={item.role}>{item.role}</span>
           <button className={classes.btnSend} onClick={()=>onOpenModel(item.maill,item.greetingType,item.title)}>שליחת ברכה</button>
        </div>
    );
}
export default GreetingItem;


