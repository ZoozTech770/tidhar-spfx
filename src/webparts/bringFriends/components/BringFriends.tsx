import * as React from 'react';
import { IBringFriendsProps } from './IBringFriendsProps';
import BringFriendsUI from "../../../components/BringFriends/bringFriends";
const BringFriends: React.FC<IBringFriendsProps> = (props) => {
  const {
    title,
    description,
    buttonText,
    buttonLink,
    buttonNewTab
  } = props;
  return (
   <BringFriendsUI Title={title} Description={description} URL={{Text:buttonText,Url:buttonLink,OpenURLInNewTab:buttonNewTab}}/>
  );
}
export default BringFriends;

