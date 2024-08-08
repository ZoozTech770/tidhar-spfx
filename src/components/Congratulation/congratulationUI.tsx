import { Toggle } from "@fluentui/react";
import { format } from "date-fns";
import * as React from "react";
import { useState } from "react";
import useWindowSizeListener from "../../util/useWindowSizeListener";
import classes from "./congratulationUI.module.scss";
import ContainerModel from "../ContainerModel";
import SendGreetingModel from "../GreetingsUI/SendGreetingModel/sendGreetingModel";

type CongartulationUIProps = {
  title: string;
  img: string;
  link: string;
  data: any[];
  hex?: string;
  mobileItems: number;
  linkText?: string;
  onGetGreetingCard: Function;
  onSendGreeting: Function;
};

const arrowIcon = require("../../assets/icons/vectorLeftIcon.svg");

const CongartulationUI = ({
  title,
  img,
  link,
  data,
  hex,
  mobileItems,
  linkText,
  onGetGreetingCard,
  onSendGreeting,
}: CongartulationUIProps) => {
  const { isDesktopView } = useWindowSizeListener();
  const [show, setShow] = useState(false);

  const toggleShow = () => {
    setShow(!show);
  };

  const [openSendGreetingModel, setOpenSendGreetingModel] =
    useState<boolean>(false);
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

  const text = (title: string, item: any) => {
    switch (title) {
      case "ימי הולדת":
        return `מזל טוב ל${item.eldGreetingType1.Title}ך`;
      case "תדהרולדת":
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
      <div className={classes.congratulation}>
        <div
          className={classes.title}
          style={{ backgroundColor: hex ? hex : "#044338" }}
        >
          <img src={img} alt={title} />
          <h3>{title}</h3>
        </div>
        <div className={classes.body}>
          <ul>
            {data.length !== 0 ? (
              isDesktopView ? (
                data?.map((item) => (
                  <li>
                    <img
                      src={`https://tidharconil.sharepoint.com/_layouts/15/userphoto.aspx?size=M&accountname=${item.eldUser.EMail}`}
                      alt=""
                    />
                    <div>
                      <h5>{item.eldUser.Title}</h5>
                      <span className={classes.date}>
                        {format(new Date(item.eldDate), "dd.MM")}
                      </span>
                      <span>{text(title, item)}</span>
                      <div>
                        {item.eldUser.JobTitle && (
                          <span className={classes.department}>
                            {item.eldUser.JobTitle}
                          </span>
                        )}
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
                  </li>
                ))
              ) : (
                data?.slice(0, show ? data.length : mobileItems).map((item) => (
                  <li>
                    <img
                      src={`https://tidharconil.sharepoint.com/_layouts/15/userphoto.aspx?size=M&accountname=${item.eldUser.EMail}`}
                      alt=""
                    />
                    <div>
                      <h5>{item.eldUser.Title}</h5>
                      <span className={classes.date}>
                        {format(new Date(item.eldDate), "dd.MM")}
                      </span>
                      <span>{text(title, item)}</span>
                      <div>
                        {item.eldUser.JobTitle && (
                          <span className={classes.department}>
                            {item.eldUser.JobTitle}
                          </span>
                        )}
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
                  </li>
                ))
              )
            ) : (
              <li className={classes.noResults}>
                <span>אין תוצאות</span>
              </li>
            )}
          </ul>
        </div>
        <div className={classes.footer}>
          {/* {!isDesktopView && data.length > mobileItems && (
            <button onClick={toggleShow}>
              {show ? "צמצם" : `טען עוד (${data.length - mobileItems})`}
            </button>
          )} */}
          <a href={link} target="_blank">
            <span>{linkText}</span>
            <img src={arrowIcon} alt="arrow icon" />
          </a>
        </div>
      </div>
      {openSendGreetingModel && (
        <ContainerModel
          panelViewOnMobile={true}
          isOpen={openSendGreetingModel}
          onClose={onCloseModel}
          childern={
            <SendGreetingModel
              onSendGreeting={onSendGreeting}
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
    </>
  );
};
export default CongartulationUI;
