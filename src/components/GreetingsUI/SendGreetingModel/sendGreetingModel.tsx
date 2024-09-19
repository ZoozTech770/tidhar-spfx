import * as React from "react";
import classes from "./sendGreetingModel.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation, FreeMode } from "swiper";
import { useEffect, useState } from "react";
import "./sendGreetingModel.scss";

type IGreetingsProps = {
  greetingType: number;
  onSendGreeting: Function;
  mail: string;
  onclose: Function;
  onGetGreetingCard: Function;
};
const SendGreetingModel: React.FC<IGreetingsProps> = (props) => {
  const { onSendGreeting, mail, greetingType, onclose, onGetGreetingCard } =
    props;
  const [greetingsCardList, SetGreetingsCardList] = useState<string[]>([]);
  const ArrowRight = require("../../../assets/icons/arrowRight.svg");
  const [activeIndex, setActiveIndex] = useState(0);
  const [greetingsLargerThanOne, setGreetingsLargerThanOne] = useState(false);

  const isDesktopView = window.screen.width > 430;
  const onSend = () => {
    const content = (document.getElementById("textarea") as HTMLInputElement)
      ?.value;
    const reetingCard =
      activeIndex != null ? greetingsCardList[activeIndex] : "";
    onSendGreeting(mail, reetingCard, content);
    onclose();
  };
  useEffect(() => {
    (async () => {
      const res = await onGetGreetingCard(greetingType);
      SetGreetingsCardList(res);
    })();
  }, []);

  useEffect(() => {
    if (greetingsCardList && greetingsCardList.length > 1) {
      setGreetingsLargerThanOne(true);
      return;
    }
    setGreetingsLargerThanOne(false);
  }, [greetingsCardList]);

  return (
    <div className={classes.sendGreetingModel}>
      <div className={classes.sendGreetingModelBody}>
        <span className={classes.selectGreeting}>
          לחצו לבחירת ברכה <span className={classes.required}> *</span>
        </span>
        <div className={classes.sliderContainer}>
          <button
            id="prevGreetingsModalSlider"
            disabled={!greetingsLargerThanOne}
            className={`navigationButtonGreeting prev listType ${greetingsLargerThanOne ? "" : classes.buttonDisabled
              }`}
          >
            <img src={ArrowRight} alt="הקודם" />
          </button>
          <Swiper
            className="greetings-list-slider"
            slidesPerView={
              isDesktopView || greetingsCardList.length < 2 ? 1 : 1.5
            }
            spaceBetween={16}
            loop={greetingsLargerThanOne ? true : false}
            loopedSlides={
              greetingsLargerThanOne ? greetingsCardList.length : undefined
            }
            dir="rtl"
            freeMode={true}
            modules={[Navigation, FreeMode]}
            effect="fade"
            breakpoints={{
              430: {
                navigation: {
                  enabled: true,
                  nextEl: "#nextGreetingsModalSlider",
                  prevEl: "#prevGreetingsModalSlider",
                },
                freeMode: true,
                spaceBetween: 0,
              },
            }}
          >
            {greetingsCardList?.map((item, i) => {
              return (
                <SwiperSlide key={i}>
                  <button
                    onClick={() => setActiveIndex(i)}
                    className={`${classes.greetingCardButton} ${activeIndex == i ? classes.activeGreetingCardButton : ""
                      } ${!isDesktopView && greetingsCardList.length < 2
                        ? classes.singleCard
                        : ""
                      }`}
                  >
                    <img src={item} className={classes.imgCard} />
                  </button>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <button
            id="nextGreetingsModalSlider"
            disabled={!greetingsLargerThanOne}
            className={`navigationButtonGreeting next listType ${greetingsLargerThanOne ? "" : classes.buttonDisabled
              }`}
          >
            <img src={ArrowRight} alt="הבא" />
          </button>
        </div>
        <div className={classes.freeTextContainer}>
          <label>אני רוצה לאחל</label>
          <textarea id="textarea"></textarea>
        </div>
      </div>
      <div className={classes.btnContiner}>
        <button
          className={classes.btnSend}
          onClick={() => onSend()}
          disabled={activeIndex === null}
        >
          שליחת ברכה
        </button>
      </div>
    </div>
  );
};
export default SendGreetingModel;
