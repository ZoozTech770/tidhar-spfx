import * as React from 'react';
import classes from './newEmployeeItem.module.scss';
import { UserType } from "../../../interfaces/Types";
import { useState } from 'react';
import ContainerModel from '../../ContainerModel';
import SendGreetingModel from '../../GreetingsUI/SendGreetingModel/sendGreetingModel';
type EmployeeItemProps = {
  onSendGreeting:Function,
  onGetGreetingCard:Function,
  user:UserType
}
const EmployeeItem: React.FC<EmployeeItemProps> = (props) => {
  const {
    onSendGreeting,
    onGetGreetingCard,
    user
  } = props;
  const [openSendGreetingModel, setOpenSendGreetingModel] = useState<boolean>(false);
  const onOpenModel = () => {
    setOpenSendGreetingModel(true);
  }
  const onCloseModel = () => {
    setOpenSendGreetingModel(false);
  }
  return (
    <div className={classes.newEmployeesItem}>
      <div className={classes.userInfo}>
        <div className={classes.picture}><img src={user.Picture.UrlLaptop} /></div>
        <div className={classes.details}>
          <div className={classes.name}>{user.Name}</div>
          <div className={classes.role} title={user.Role}>{user.Role}</div>
        </div>
      </div>
      <div className={classes.sendBlessing}>
        <button onClick={()=>onOpenModel()}>שליחת ברכה</button>
      </div>
      {openSendGreetingModel && <ContainerModel panelViewOnMobile={true} isOpen={openSendGreetingModel} onClose={onCloseModel} childern={<SendGreetingModel onSendGreeting={onSendGreeting} onGetGreetingCard={onGetGreetingCard} mail={user.Email} greetingType={1} onclose={onCloseModel}></SendGreetingModel>} title={`שלח ברכה ל${user.Name}`} topViewOnMobile={false}></ContainerModel>}
    </div>
  );
}
export default EmployeeItem;