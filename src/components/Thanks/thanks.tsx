import * as React from 'react';
import classes from './thanks.module.scss';
import {IThanksWP} from "../../interfaces/IThanksWP";
const ThanksUI: React.FC<IThanksWP> = (props) => {
  const {
  Title,
  Item,
  ToAllUrl
  } = props;

  return (
    <div className={classes.thankContainer}>
        <div className={classes.title}>{Title}</div>
       {Item? <a href={Item.URL?Item.URL.Url:"#"}><div className={classes.content}>
       {Item.Image && <img className={classes.img} src={Item.Image.UrlLaptop} alt={Item.Image.Alt}/>}
            <div className={classes.subTitle}>{Item.SubTitle}</div>
       </div></a>:null}
         <div className={classes.link}> <a href={ToAllUrl.Url} target={ToAllUrl.OpenURLInNewTab?"_blank":"_self"} data-interception="off">{ToAllUrl.Text}</a></div>
    </div>
  );
}
export default ThanksUI;