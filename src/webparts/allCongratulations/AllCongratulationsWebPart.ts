import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  BaseComponentContext,
  IReadonlyTheme,
} from "@microsoft/sp-component-base";

import * as strings from "AllCongratulationsWebPartStrings";
import AllCongratulations from "./components/AllCongratulations";
import { IAllCongratulationsProps } from "./components/IAllCongratulationsProps";

export interface IAllCongratulationsWebPartProps {
  headerColor: string;
  headerIcon: string;
  list: string;
  congratsType: string;
  title: string;
  compTitle: string;
  linkTag: string;
  logList: string;
  cardList: string;
  context: any;
}

export default class AllCongratulationsWebPart extends BaseClientSideWebPart<IAllCongratulationsWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";

  public render(): void {
    const element: React.ReactElement<IAllCongratulationsProps> =
      React.createElement(AllCongratulations, {
        headerColor: this.properties.headerColor,
        headerIcon: this.properties.headerIcon,
        list: this.properties.list,
        title: this.properties.title,
        compTitle: this.properties.compTitle,
        congratsType: this.properties.congratsType,
        linkTag: this.properties.linkTag,
        logList: this.properties.logList,
        cardList: this.properties.cardList,
        context: this.context,
      });

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then((message) => {
      this._environmentMessage = "";
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app
        .getContext()
        .then((context) => {
          let environmentMessage: string = "";
          switch (context.app.host.name) {
            case "Office": // running in Office
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOffice
                : strings.AppOfficeEnvironment;
              break;
            case "Outlook": // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOutlook
                : strings.AppOutlookEnvironment;
              break;
            case "Teams": // running in Teams
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentTeams
                : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error("Unknown host");
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(
      this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentSharePoint
        : strings.AppSharePointEnvironment
    );
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        "--bodyText",
        semanticColors.bodyText || null
      );
      this.domElement.style.setProperty("--link", semanticColors.link || null);
      this.domElement.style.setProperty(
        "--linkHovered",
        semanticColors.linkHovered || null
      );
    }
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
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: "כללי",
              groupFields: [
                PropertyPaneTextField("compTitle", {
                  label: "כותרת ראשית",
                })
              ]
            },
            {
              groupName: "מאפייני רכיב",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: "כותרת",
                }),
                PropertyPaneTextField("headerColor", {
                  label: "צבע כותרת",
                }),
                PropertyPaneTextField("headerIcon", {
                  label: "קישור לאייקון",
                }),
                PropertyPaneTextField("list", {
                  label: "קישור לרשימה",
                }),
                PropertyPaneTextField("cardList", {
                  label: "רשימת כרטיסי ברכה",
                  description: "קישור יחסי לרשימת כרטיסי ברכה",
                }),
                PropertyPaneTextField("logList", {
                  label: "רשימת תיעוד שליחת ברכה",
                  description: "קישור יחסי לרשימת לוג שליחת ברכה",
                }),
                PropertyPaneTextField("linkTag", {
                  label: "תגית לגלילה ישירות לרכיב",
                }),
                PropertyPaneDropdown("congratsType", {
                  label: "סוג איחול",
                  options: [
                    {
                      key: "1",
                      text: "ימי הולדת",
                    },
                    {
                      key: "2",
                      text: "תדהרולדת",
                    },
                    {
                      key: "3",
                      text: "לידות",
                    },
                  ],
                  disabled: false,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
