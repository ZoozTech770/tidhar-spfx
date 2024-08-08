import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import Congratulations from "./components/Congratulations";
import { ICongratulationsProps } from "./components/ICongratulationsProps";
import { PropertyFieldNumber } from "@pnp/spfx-property-controls/lib/PropertyFieldNumber";

export interface ICongratulationsWebPartProps {
  title: string;
  list: string;
  generalLink: string;
  generalLinkText: string;
  familyHex: string;
  familyImage: string;
  familyLink: string;
  familyLinkText: string;
  familyNum: number;
  birthdayHex: string;
  birthdayImage: string;
  birthdayLink: string;
  birthdayLinkText: string;
  birthdayNum: number;
  tidharHex: string;
  tidharImage: string;
  tidharLink: string;
  tidharLinkText: string;
  tidharNum: number;
  logList: string;
  cardList: string;
  context: any;
}

export default class CongratulationsWebPart extends BaseClientSideWebPart<ICongratulationsWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ICongratulationsProps> =
      React.createElement(Congratulations, {
        title: this.properties.title,
        list: this.properties.list,
        generalLink: this.properties.generalLink,
        generalLinkText: this.properties.generalLinkText,
        familyHex: this.properties.familyHex,
        familyImage: this.properties.familyImage,
        familyLink: this.properties.familyLink,
        familyLinkText: this.properties.familyLinkText,
        familyNum: this.properties.familyNum,
        birthdayHex: this.properties.birthdayHex,
        birthdayImage: this.properties.birthdayImage,
        birthdayLink: this.properties.birthdayLink,
        birthdayLinkText: this.properties.birthdayLinkText,
        birthdayNum: this.properties.birthdayNum,
        tidharHex: this.properties.tidharHex,
        tidharImage: this.properties.tidharImage,
        tidharLink: this.properties.tidharLink,
        tidharLinkText: this.properties.tidharLinkText,
        tidharNum: this.properties.tidharNum,
        logList: this.properties.logList,
        cardList: this.properties.cardList,
        context: this.context,
      });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "מאפייני רכיב",
          },
          groups: [
            {
              groupName: "כללי",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: "כותרת הרכיב",
                }),
                PropertyPaneTextField("list", {
                  label: "רשימה",
                  description: "קישור יחסי לרשימת אירועים",
                }),
                PropertyPaneTextField("cardList", {
                  label: "רשימת כרטיסי ברכה",
                  description: "קישור יחסי לרשימת כרטיסי ברכה",
                }),
                PropertyPaneTextField("logList", {
                  label: "רשימת תיעוד שליחת ברכה",
                  description: "קישור יחסי לרשימת לוג שליחת ברכה",
                }),
                PropertyPaneTextField("generalLink", {
                  label: "קישור",
                  description: "קישור לכל הפריטים",
                }),
                PropertyPaneTextField("generalLinkText", {
                  label: "טקסט לקישור",
                  description: "מלל לקישור",
                }),
              ],
            },
            {
              groupName: "המשפחה מתרחבת",
              groupFields: [
                PropertyPaneTextField("familyHex", {
                  label: "צבע הכותרת",
                  description: "צבע הכותרת ב-HEX",
                }),
                PropertyPaneTextField("familyImage", {
                  label: "אייקון",
                  description: "קישור לאייקון",
                }),
                PropertyPaneTextField("familyLink", {
                  label: "קישור",
                  description: "קישור לכל הפריטים",
                }),
                PropertyPaneTextField("familyLinkText", {
                  label: "טקסט הקישור",
                  description: "מלל לקישור",
                }),
                PropertyFieldNumber("familyNum", {
                  label: "מספר הפריטים להצגה במובייל",
                  description: "מספר נומרי",
                  value: this.properties.familyNum,
                  maxValue: 10,
                  minValue: 1,
                  disabled: false,
                  key: "familyNumKey",
                }),
              ],
            },
            {
              groupName: "ימיהולדת",
              groupFields: [
                PropertyPaneTextField("birthdayHex", {
                  label: "צבע הכותרת",
                  description: "צבע הכותרת ב-HEX",
                }),
                PropertyPaneTextField("birthdayImage", {
                  label: "אייקון",
                  description: "קישור לאייקון",
                }),
                PropertyPaneTextField("birthdayLink", {
                  label: "קישור",
                  description: "קישור לכל הפריטים",
                }),
                PropertyPaneTextField("birthdayLinkText", {
                  label: "טקסט הקישור",
                  description: "מלל לקישור",
                }),
                PropertyFieldNumber("birthdayNum", {
                  label: "מספר הפריטים להצגה במובייל",
                  description: "מספר נומרי",
                  value: this.properties.birthdayNum,
                  maxValue: 10,
                  minValue: 1,
                  disabled: false,
                  key: "birthdayNumKey",
                }),
              ],
            },
            {
              groupName: "תדהרהולדת",
              groupFields: [
                PropertyPaneTextField("tidharHex", {
                  label: "צבע הכותרת",
                  description: "צבע הכותרת ב-HEX",
                }),
                PropertyPaneTextField("tidharImage", {
                  label: "אייקון",
                  description: "קישור לאייקון",
                }),
                PropertyPaneTextField("tidharLink", {
                  label: "קישור",
                  description: "קישור לכל הפריטים",
                }),
                PropertyPaneTextField("tidharLinkText", {
                  label: "טקסט הקישור",
                  description: "מלל לקישור",
                }),
                PropertyFieldNumber("tidharNum", {
                  label: "מספר הפריטים להצגה במובייל",
                  description: "מספר נומרי",
                  value: this.properties.tidharNum,
                  maxValue: 10,
                  minValue: 1,
                  disabled: false,
                  key: "tidharNumKey",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
