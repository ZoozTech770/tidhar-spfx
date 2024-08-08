import * as React from 'react';
import { IGreetingsProps } from './IGreetingsProps';
import { useState, useEffect } from 'react';
import { GreetingsService } from '../../../services/GreetingsService';
import { greetingLogItem } from '../../../types/TGreetingLogItem';
import GreetingsUI from '../../../components/GreetingsUI/greetingsUI';
import { LinkType } from '../../../interfaces/Types';

const Greetings: React.FC<IGreetingsProps> = (props) => {
  const {
    title,
    list,
    typeList,
    logList,
    cardList,
    sendGreetingTitle,
    toAllLinkTitle,
    toAllLinkUrl,
    toAllLinkNewTab,
    showAsSlider,
    context,
    autoPlayDelay
  } = props;

  const [greetingsList, setGreetingsList] = useState<any[]>([]);
  const [greetingTypeList, setGreetingTypesList] = useState<any[]>([]);
  const linkAllGreetings: LinkType = { Url: toAllLinkUrl, Text: toAllLinkTitle, OpenURLInNewTab: toAllLinkNewTab };

  useEffect(() => {
    (async () => {
      const [greetingTypes, greetings] = await Promise.all([
        GreetingsService.getGreetingTypes(context, typeList),
        GreetingsService.getGreetings(context, list)
      ]);
      setGreetingTypesList(greetingTypes);
      setGreetingsList(greetings);
    })();
  }, []);
  const getGreetingCards = async (cardTypeId: number) => {
    const res = await GreetingsService.getGreetingCards(context, cardList, cardTypeId);
    return res;
  }
  const addGreetingItem = async (receiver: string, reetingCard: string, content: string) => {
    let item: greetingLogItem = {
      title: receiver,
      date: new Date(),
      receiver: receiver,
      reetingCard: reetingCard,
      sender: context.pageContext.user.displayName,
      senderEmail: context.pageContext.user.loginName,
      content: content,
    }
    const res = await GreetingsService.addGreetingItem(context, logList, item);
  }

  return (
    <GreetingsUI showAsSlider={showAsSlider} title={title} greetingsList={greetingsList} linkAllGreetings={linkAllGreetings} greetingTypeList={greetingTypeList} autoPlayDelay={autoPlayDelay} sendGreetingsTitle={sendGreetingTitle} onGetGreetingCard={getGreetingCards} onSendGreeting={addGreetingItem} ></GreetingsUI>
  );
}
export default Greetings;

