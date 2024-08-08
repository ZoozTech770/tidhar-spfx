import * as React from "react";
import styles from "./AllCongratulations.module.scss";
import { IAllCongratulationsProps } from "./IAllCongratulationsProps";
import { useState, useEffect } from "react";
import { CongratulationService } from "../../../services/CongratulationService";
import AllCongartulationUI from "../../../components/AllCongratulation/allCongratulationUI";
import { GreetingsService } from "../../../services/GreetingsService";
import { greetingLogItem } from "../../../types/TGreetingLogItem";

const AllCongratulations: React.FC<IAllCongratulationsProps> = (props) => {
  const {
    headerColor,
    headerIcon,
    list,
    congratsType,
    title,
    compTitle,
    linkTag,
    cardList,
    logList,
    context,
  } = props;

  const [data, setData] = useState([]);
  const [mobileData, setMobileData] = useState<any>([])


  useEffect(() => {
    CongratulationService.getMonthCongrats(
      context,
      list,
      parseInt(congratsType)
    ).then((data) => {
      setData(data);
    });
  }, []);

  useEffect(()=>{
    const result = [];
    for (let i = 0; i < data.length; i += 5) {
        const chunk = data.slice(i, i + 5);
        result.push(chunk);
    }
    setMobileData(result);
  }, [data])




  const ref = React.useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      const hashtag = window.location.hash.replace("#", "");
      if (hashtag === linkTag) {
        ref.current.scrollIntoView();
      }
    }
  }, [ref.current, window.location.hash]);

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
    <section className={styles.allCongratulations} id={linkTag} ref={ref}>
      {compTitle && <h2 className={styles.title}>{compTitle}</h2>}
      <AllCongartulationUI
        headerColor={headerColor}
        headerIcon={headerIcon}
        title={title}
        data={data}
        congratsType={congratsType}
        mobileItems={0}
        onGetGreetingCard={getGreetingCards}
        onSendGreeting={addGreetingItem}
        mobileData={mobileData}
      />
    </section>
  );
};

export default AllCongratulations;
