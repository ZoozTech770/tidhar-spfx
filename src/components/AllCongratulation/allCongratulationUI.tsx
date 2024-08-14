import { format } from "date-fns";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper";
import * as React from "react";
import { useRef, useState, useLayoutEffect } from "react";
import useWindowSizeListener from "../../util/useWindowSizeListener";
import classes from "./allCongratulationUI.module.scss";
import { Guid } from "@microsoft/sp-core-library";
import ContainerModel from "../ContainerModel";
import SendGreetingModel from "../GreetingsUI/SendGreetingModel/sendGreetingModel";

type AllCongartulationProps = {
  headerColor: string;
  headerIcon: string;
  title: string;
  congratsType: string;
  data: any[];
  onSlideEnd: Function;
  mobileItems: number;
  onGetGreetingCard: Function;
  onSendGreeting: Function;
  mobileData: any[];
};

const ArrowRight = require("../../assets/icons/ArrowRight.svg");
const registeredIcon = require("../../assets/icons/registeredIcon.svg");


const AllCongartulationUI = ({
  headerColor,
  headerIcon,
  title,
  data,
  onSlideEnd,
  congratsType,
  mobileData,
  mobileItems,
  onGetGreetingCard,
  onSendGreeting,
}: AllCongartulationProps) => {
  const { isDesktopView } = useWindowSizeListener();
  const [show, setShow] = useState(false);
  const swiperRef = useRef<SwiperRef>(null);

  const [openSendGreetingModel, setOpenSendGreetingModel] =
    useState<boolean>(false);
  const [greetingSent, setGreetingSent] = useState<boolean>(false);
  const [mail, setMail] = useState<string>("");
  const [greetingType, setGreetingType] = useState<number>(1);
  const [receiverName, setReceiverName] = useState<string>("");

  const onOpenModel = (
    mail: string,
    greetingType: number,
    receiverName: string
  ) => {
    setMail(mail);
    setGreetingType(greetingType);
    setReceiverName(receiverName);
    setOpenSendGreetingModel(true);
  };

  const onCloseModel = () => {
    setOpenSendGreetingModel(false);
  };

  const onSendGreetingSuccess = (receiver: string, reetingCard: string, content: string) => {
    onSendGreeting(receiver, reetingCard, content);
    setGreetingSent(true);
  }
  const onCloseGreetingSentModel = () => {
    setGreetingSent(false);
  };

  const onSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiperEl = swiperRef.current.swiper.el;
      const activeBullet = swiperEl.getElementsByClassName(
        "swiper-pagination-bullet-active"
      )[0];
      if (activeBullet) {
        activeBullet.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
        // Add a 20px offset after scrolling into view
        setTimeout(() => {
          swiperEl.scrollTop += 20; // Adjust this value as needed for your offset
        }, 500); // Timeout to ensure scrollIntoView is completed
        onSlideEnd();
      }
    }
  };

  useLayoutEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const compID = urlParams.get("comp");
    if (compID && document.getElementById(compID)) {
      document.getElementById(compID).scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, []);

  const guid = Guid.newGuid();

  const text = (item: any) => {
    switch (congratsType) {
      case "1":
        return `מזל טוב ל${item.eldGreetingType1.Title}ך`;
      case "2":
        const eldDate = new Date(item["eldDate"]);
        const now = new Date();
        const yearsDiff = (
          (now.getTime() - eldDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
        ).toFixed();
        return `${item.eldGreetingType1.Title} ${yearsDiff} שמח`;
      default:
        return `מזל טוב ל${item.eldGreetingType1.Title}`;
    }
  };
  return (
    <>
      <div
        className={`${classes.congratulation} ${!isDesktopView && classes.mobile
          }`}
        id={title}
      >
        <div
          className={classes.title}
          style={{ backgroundColor: headerColor ? headerColor : "#044338" }}
        >
          <img src={headerIcon} alt={title} />
          <h3>{title}</h3>
        </div>
        <div className={classes.body}>
          <button
            id={`greetingsNavPrev_${guid}`}
            className={`${classes.navigationButtonGreeting} ${classes.prev} ${data.length > 6 ? "" : "hide"
              }`}
          >
            <img src={ArrowRight} alt="הקודם" />
          </button>
          <div className={classes.congratsSwiper}>
            {data.length !== 0 ? (
              isDesktopView ? (
                <Swiper
                  ref={swiperRef}
                  modules={[Pagination, Navigation, Autoplay]}
                  slidesPerView={6}
                  dir="rtl"
                  initialSlide={1}
                  slidesPerGroup={6}
                  navigation={{
                    enabled: true,
                    nextEl: `#greetingsNavNext_${guid}`,
                    prevEl: `#greetingsNavPrev_${guid}`,
                    lockClass: "locked",
                  }}
                  pagination={{
                    enabled: true,
                    clickable: true,
                    renderBullet: (index, className) => {
                      return (
                        '<span class="' +
                        className +
                        " " +
                        classes.paginationNum +
                        '">' +
                        (index + 1) +
                        "</span>"
                      );
                    },
                  }}
                >
                  {data?.map((item, i) => (
                    <SwiperSlide key={i}>
                      <div className={classes.congratsItem}>
                        <img
                          src={`https://tidharconil.sharepoint.com/_layouts/15/userphoto.aspx?size=M&accountname=${item.eldUser.EMail}`}
                          alt=""
                        />
                        <div>
                          <h5>{item.eldUser.Title}</h5>
                          <span>{text(item)}</span>
                          <div>
                            <span className={classes.date}>
                              {format(new Date(item.eldDate), "dd.MM")}
                            </span>
                          </div>
                          <div>
                            <span
                              className={classes.department}
                              title={item.eldUser.JobTitle}
                            >
                              {item.eldUser.JobTitle}
                            </span>
                          </div>
                        </div>
                        <button
                          className={classes.sendCardButton}
                          onClick={() =>
                            onOpenModel(
                              item.eldUser.EMail,
                              item.eldGreetingType1Id,
                              item.eldUser.Title
                            )
                          }
                        >
                          שליחת ברכה
                        </button>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <Swiper
                  ref={swiperRef}
                  modules={[Pagination, Navigation, Autoplay]}
                  slidesPerView={1}
                  dir="rtl"
                  slidesPerGroup={1}
                  navigation={{
                    enabled: true,
                    nextEl: `#greetingsNavNext_${guid}`,
                    prevEl: `#greetingsNavPrev_${guid}`,
                    lockClass: "locked",
                  }}
                  pagination={{
                    enabled: true,
                    clickable: true,
                    horizontalClass: "swiper-pagination-horizontal",
                    renderBullet: (index, className) => {
                      return (
                        '<span class="' +
                        className +
                        " " +
                        classes.paginationNum +
                        '">' +
                        (index + 1) +
                        "</span>"
                      );
                    },
                  }}
                  onSlideChangeTransitionStart={() => onSlide()}
                >
                  {mobileData.length > 0 &&
                    mobileData?.map((group, i) => (
                      <SwiperSlide key={i}>
                        {group.map((item, index) => (
                          <div className={classes.congratsItemMobile}>
                            <img
                              src={`https://tidharconil.sharepoint.com/_layouts/15/userphoto.aspx?size=M&accountname=${item.eldUser.EMail}`}
                              alt=""
                            />
                            <div>
                              <h5>{item.eldUser.Title}</h5>
                              <span className={classes.date}>
                                {format(new Date(item.eldDate), "dd.MM")}
                              </span>
                              <span>{text(item)}</span>
                              <div>
                                {item.eldUser.JobTitle && (
                                  <span className={classes.department}>
                                    {item.eldUser.JobTitle}
                                  </span>
                                )}
                              </div>
                              <button
                                className={classes.sendCardButton}
                                onClick={() =>
                                  onOpenModel(
                                    item.eldUser.EMail,
                                    item.eldGreetingType1Id,
                                    item.eldUser.Title
                                  )
                                }
                              >
                                שליחת ברכה
                              </button>
                            </div>
                          </div>
                        ))}
                      </SwiperSlide>
                    ))}
                </Swiper>
              )
            ) : (
              <p>אין תוצאות</p>
            )}
          </div>
          <button
            id={`greetingsNavNext_${guid}`}
            className={`${classes.navigationButtonGreeting} ${classes.next} ${data.length > 6 ? "" : "hide"
              }`}
          >
            <img src={ArrowRight} alt="הבא" />
          </button>
        </div>
      </div>
      {openSendGreetingModel && (
        <ContainerModel
          panelViewOnMobile={true}
          isOpen={openSendGreetingModel}
          onClose={onCloseModel}
          childern={
            <SendGreetingModel
              onSendGreeting={onSendGreetingSuccess}
              onGetGreetingCard={onGetGreetingCard}
              greetingType={greetingType}
              mail={mail}
              onclose={onCloseModel}
            ></SendGreetingModel>
          }
          title={`שליחת ברכה ל${receiverName}`}
          topViewOnMobile={false}
        ></ContainerModel>
      )}
      {greetingSent && (
        <ContainerModel
          panelViewOnMobile={true}
          isOpen={greetingSent}
          hideCloseButton={true}
          onClose={onCloseGreetingSentModel}
          childern={
            <div className={classes.greetingSuccess}>
              <img src={registeredIcon} alt="" />
            </div>
          }
          title={`הברכה נשלחה`}
          topViewOnMobile={false}
        ></ContainerModel>
      )}
    </>
  );
};
export default AllCongartulationUI;
