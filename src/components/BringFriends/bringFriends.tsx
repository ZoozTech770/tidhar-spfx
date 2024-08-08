import * as React from 'react';
import classes from './bringFreinds.module.scss';
import {IFriednsWP} from "../../interfaces/IFriednsWP";
const BringFriendsUI: React.FC<IFriednsWP> = (props) => {
  const {
  Title,
  Description,
  URL
  } = props;

  return (
    <div className={classes.bringFriendsContainer}>
        <div className={classes.title}>{Title}</div>
        <div className={classes.description}>{Description}</div>
         <div className={classes.link}> <a href={URL.Url} target={URL.OpenURLInNewTab?"_blank":"_self"} data-interception="off">{URL.Text}</a></div>
    </div>
  );
}
export default BringFriendsUI;