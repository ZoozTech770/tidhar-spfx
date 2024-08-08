import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./Congratulations.module.scss";
import { ICongratulationsProps } from "./ICongratulationsProps";
import CongartulationUI from "../../../components/Congratulation/congratulationUI";
import { CongratulationService } from "../../../services/CongratulationService";
import { greetingLogItem } from "../../../types/TGreetingLogItem";
import { GreetingsService } from "../../../services/GreetingsService";

const arrowIcon = require("../../../assets/icons/vectorLeftIcon.svg");

const Congratulations: React.FC<ICongratulationsProps> = (props) => {
  const {
    title,
    list,
    generalLink,
    context,
    generalLinkText,
    familyHex,
    familyImage,
    familyLink,
    familyLinkText,
    familyNum,
    birthdayHex,
    birthdayImage,
    birthdayLink,
    birthdayLinkText,
    birthdayNum,
    tidharHex,
    tidharImage,
    tidharLink,
    tidharLinkText,
    tidharNum,
    logList,
    cardList,
  } = props;

  const [birthdays, setBirthdays] = useState([]);
  const [tidhars, setTidhars] = useState([]);
  const [births, setBirths] = useState([]);

  useEffect(() => {
    CongratulationService.getEventsByType(context, list, 1).then((data) => {
      setBirthdays(data);
    });
    CongratulationService.getEventsByType(context, list, 2).then((data) => {
      setTidhars(data);
    });
    CongratulationService.getBirths(context, list).then((data) => {
      setBirths(data);
    });
  }, []);

  const getGreetingCards = async (cardTypeId: number) => {
    const res = await GreetingsService.getGreetingCards(
      context,
      cardList,
      cardTypeId
    );
    return res;
  };
  const addGreetingItem = async (
    receiver: string,
    reetingCard: string,
    content: string
  ) => {
    let item: greetingLogItem = {
      title: receiver,
      date: new Date(),
      receiver: receiver,
      reetingCard: reetingCard,
      sender: context.pageContext.user.displayName,
      senderEmail: context.pageContext.user.loginName,
      content: content,
    };
    const res = await GreetingsService.addGreetingItem(context, logList, item);
  };

  return (
    <section className={`${styles.congratulationsContainer}`}>
      <div className={styles.congratulations}>
        <div className={styles.header}>
          <h2>{title}</h2>
          {generalLink && (
            <a href={generalLink} target="_blank">
              {generalLinkText}
              <img src={arrowIcon} alt="arrow icon" />
            </a>
          )}
        </div>
        <div className={styles.container}>
          <div>
            <CongartulationUI
              title={"המשפחה מתרחבת"}
              img={familyImage}
              link={familyLink}
              linkText={familyLinkText}
              hex={familyHex}
              mobileItems={familyNum}
              data={births}
              onGetGreetingCard={getGreetingCards}
              onSendGreeting={addGreetingItem}
            />
          </div>
          <div>
            <CongartulationUI
              title={"ימי הולדת"}
              img={birthdayImage}
              link={birthdayLink}
              linkText={birthdayLinkText}
              hex={birthdayHex}
              mobileItems={birthdayNum}
              data={birthdays}
              onGetGreetingCard={getGreetingCards}
              onSendGreeting={addGreetingItem}
            />
          </div>
          <div>
            <CongartulationUI
              title={"תדהרולדת"}
              img={tidharImage}
              link={tidharLink}
              linkText={tidharLinkText}
              hex={tidharHex}
              mobileItems={tidharNum}
              data={tidhars}
              onGetGreetingCard={getGreetingCards}
              onSendGreeting={addGreetingItem}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Congratulations;
