import * as React from 'react';
import { useState, useEffect } from 'react';
import { INewEmployeesProps } from './INewEmployeesProps';
import { NewEmployeesService } from '../../../services/NewEmployeesService';
import NewEmployeesUI from '../../../components/NewEmployees/newEmployees';
import { greetingLogItem } from '../../../types/TGreetingLogItem';
const NewEmployees: React.FC<INewEmployeesProps> = (props) => {
  const {
    title,
    list,
    autoPlayDelay,
    cardList,
    logList,
    toAllLinkUrl,
    toAllLinkTitle,
    toAllLinkNewTab,
    context
  } = props;

  const [newEmployeesList, SetNewEmployeesList] = useState<any[]>([]);


  useEffect(() => {
    (async () => {
      const rawResponse = await NewEmployeesService.getNewEmployees(context, list);
      SetNewEmployeesList(rawResponse);

    })();
  }, []);
  const getCards = async () => {
    const rawResponse = await NewEmployeesService.getGreetingCards(context, cardList);
    return rawResponse;
  }

  const addGreetingItem = async (receiver: string, reetingCard: string, content: string) => {
    let item: greetingLogItem = {
      title: receiver,
      date: new Date(),
      receiver: receiver,
      reetingCard: reetingCard,
      senderEmail: context.pageContext.user.email,
      sender: context.pageContext.user.displayName,
      content: content,
    }
    const res = await NewEmployeesService.addGreetingItem(context, logList, item);
  }
  return (
    <NewEmployeesUI Title={title}
      ToAllUrl={{ Text: toAllLinkTitle, Url: toAllLinkUrl, OpenURLInNewTab: toAllLinkNewTab }}
      getGreetingCards={getCards}
      autoPlayDelay={autoPlayDelay}
      Users={newEmployeesList}
      onSendGreeting={addGreetingItem} />
  );
}
export default NewEmployees;
