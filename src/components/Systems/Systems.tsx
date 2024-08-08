import * as React from "react";
import classes from "./systems.module.scss";
import { SystemListItem } from "../../interfaces/ISystemListItem";
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "./systemsSlider.scss";
import { useState } from "react";
import useWindowSizeListener from "../../util/useWindowSizeListener";

type SystemsProps = {
  closeSystemModal: Function;
  systemList: SystemListItem[];
  systemPopupRef: React.MutableRefObject<HTMLDivElement>;
  onAllSystemButtonClick: Function;
  unfloat?: boolean;
};

const ArrowRight = require("../../assets/ArrowRight.svg");
const ArrowLeft = require("../../assets/ArrowLeft.svg");
const closeIcon = require("../../assets/icons/closeIcon-green.svg");

const SystemsUI = ({
  systemList,
  systemPopupRef,
  closeSystemModal,
  onAllSystemButtonClick,
  unfloat,
}: SystemsProps) => {
  const { isDesktopView } = useWindowSizeListener();
  const [expanded, setExpanded] = useState(false);

  const onChooseSystemsClick = () => {
    onAllSystemButtonClick();
  };

  const ToggleExpand = () => {
    setExpanded(!expanded);
  };

  if (systemList)
    return (
      <div ref={systemPopupRef}>
        <div className={classes.systems}>
          <h3 className={classes.systemsTitle}>המערכות שלי</h3>
          <div className={classes.desktopSystemsContainer}>
            <div className={classes.containerSlider}>
              {systemList.length > 9 ? (
                <>
                  <button
                    id="prevSystemsButton"
                    className="systemsNavigationButton"
                  >
                    <img src={ArrowRight} alt="הקודם" />
                  </button>
                  <Swiper
                    className="systems-slider"
                    enabled={systemList.length > 9}
                    slidesPerView={
                      systemList.length > 9 ? 9 : systemList.length
                    }
                    spaceBetween={20}
                    loop={systemList.length > 9}
                    dir="rtl"
                    modules={[Navigation]}
                    effect="fade"
                    breakpoints={{
                      430: {
                        navigation: {
                          enabled: true,
                          nextEl: "#nextSystemsButton",
                          prevEl: "#prevSystemsButton",
                        },
                      },
                    }}
                  >
                    {systemList.map((system, i) => {
                      return (
                        <SwiperSlide key={i}>
                          <a
                            className={classes.system}
                            href={system.Url}
                            target={system.OpenURLInNewTab ? "_blank" : "_self"}
                            data-interception="off"
                          >
                            {system.Icon && (
                              <img src={system.Icon.UrlLaptop}></img>
                            )}
                            <span title={system.Title}>{system.Title}</span>
                          </a>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                  <button
                    id="nextSystemsButton"
                    className="systemsNavigationButton"
                  >
                    <img src={ArrowLeft} alt="הבא" />
                  </button>
                </>
              ) : (
                <div className={classes.systemsFlexContainer}>
                  {systemList.map((system, i) => (
                    <a
                      className={classes.system}
                      href={system.Url}
                      target={system.OpenURLInNewTab ? "_blank" : "_self"}
                      data-interception="off"
                    >
                      {system.Icon && <img src={system.Icon.UrlLaptop}></img>}
                      <span>{system.Title}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={classes.mobileSystemsContainer}>
            {systemList
              .slice(0, expanded ? systemList.length : 3)
              .map((system) => (
                <a
                  className={classes.system}
                  href={system.Url}
                  target={system.OpenURLInNewTab ? "_blank" : "_self"}
                  data-interception="off"
                >
                  {system.Icon && <img src={system.Icon.UrlLaptop}></img>}
                  <span title={system.Title}>{system.Title}</span>
                </a>
              ))}
          </div>
          <div className={classes.footer}>
            {!isDesktopView && systemList.length > 3 && (
              <button className={classes.btnExpand} onClick={ToggleExpand}>
                {expanded
                  ? `צמצום תצוגה`
                  : `הרחבת תצוגה`}
              </button>
            )}
            <button
              className={classes.btnChoiceOfSystems}
              onClick={onChooseSystemsClick}
            >
              עריכת תצוגה
            </button>
          </div>
        </div>
      </div>
    );
  return null;
};
export default SystemsUI;
