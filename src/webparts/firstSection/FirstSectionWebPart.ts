import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import FirstSection from './components/FirstSection';
import { IFirstSectionProps } from './components/IFirstSectionProps';

export interface IFirstSectionWebPartProps {
  //pending approval properties
  PAtitle: string;
  PAlist: string;
  PAlist2: string;
  PAtoAllLinkTitle: string;
  PAtoAllLinkUrl: string;
  PAtoAllLinkNewTab: boolean;
  //my inqueries
  INtitle: string;
  INlist: string;
  INnewInqTitle: string;
  INnewInqUrl: string;
  INnewInqNewTab: boolean;
  INtoAllLinkTitle: string;
  INtoAllLinkUrl: string;
  INtoAllLinkNewTab: boolean;
  //my projects
  PRtitle: string;
  PRlist: string;
  PRprojectPageTitle: string;
  //events
  Elist: string
  EeventPage: string;
  //for all
  context: any;
}

export default class FirstSectionWebPart extends BaseClientSideWebPart<IFirstSectionWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IFirstSectionProps> = React.createElement(
      FirstSection,
      {
        eventsProps: {
          list: this.properties.Elist,
          userEmail: this.context.pageContext.user.email,
          eventPage: this.properties.EeventPage,
          context: this.context
        },
        projectsProps: {
          title: this.properties.PRtitle,
          list: this.properties.PRlist,
          projectPageTitle: this.properties.PRprojectPageTitle,
          context: this.context
        },
        pendingApprovalProps: {
          title: this.properties.PAtitle,
          list: this.properties.PAlist,
          list2: this.properties.PAlist2,
          toAllLinkTitle: this.properties.PAtoAllLinkTitle,
          toAllLinkUrl: this.properties.PAtoAllLinkUrl,
          toAllLinkNewTab: this.properties.PAtoAllLinkNewTab,
          context: this.context
        },
        myInquiriesProps: {
          title: this.properties.INtitle,
          list: this.properties.INlist,
          newInqTitle: this.properties.INnewInqTitle,
          newInqLinkUrl: this.properties.INnewInqUrl,
          newInqLinkNewTab: this.properties.INnewInqNewTab,
          toAllLinkTitle: this.properties.INtoAllLinkTitle,
          toAllLinkUrl: this.properties.INtoAllLinkUrl,
          toAllLinkNewTab: this.properties.INtoAllLinkNewTab,
          context: this.context,
          showPendingApproval: this.context ? true : false,
        }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "מאפייני רכיב"
          },
          groups: [
            {
              groupName: "כללי",
              groupFields: [
                PropertyPaneCheckbox('showInAnchors', {
                  text: "האם להציג בתפריט עוגנים",
                  checked: true
                })
              ]
            },
            {
              groupName: "רכיב אירועים - כללי",
              groupFields: [
                PropertyPaneTextField('Elist', {
                  label: "רשימה",
                  description: "קישור יחסי לרשימת אירועים"
                })
              ]
            },
            {
              groupName: "קישור לדף אירוע",
              groupFields: [
                PropertyPaneTextField('EeventPage', {
                  label: "כתובת הקישור"
                })
              ]
            },
            {
              groupName: 'פרויקטים - כללי',
              groupFields: [
                PropertyPaneTextField('PRtitle', {
                  label: 'כותרת',
                }),
                PropertyPaneTextField('PRlist', {
                  label: 'רשימה',
                  description: 'קישור יחסי לרשימת פרויקטים'
                }),
              ]
            },
            {
              groupName: 'קישור לדף פרויקט',
              groupFields: [
                PropertyPaneTextField('PRprojectPageTitle', {
                  label: 'כותרת הקישור',
                })
              ]
            },
            {
              groupName: "פניות הממתינות לטיפולי - כללי",
              groupFields: [
                PropertyPaneTextField('PAtitle', {
                  label: "כותרת",
                }),
                PropertyPaneTextField('PAlist', {
                  label: "רשימה",
                  description: "קישור יחסי לרשימת ניהול בקשות"
                })
                ,
                PropertyPaneTextField('PAlist2', {
                  label: "2 רשימה",
                  description: "קישור יחסי לרשימת טפסים"
                })
              ]
            },
            {
              groupName: "פניות הממתינות לטיפולי - קישור - לכל הבקשות",
              groupFields: [
                PropertyPaneTextField('PAtoAllLinkTitle', {
                  label: "כותרת הקישור",
                }),
                PropertyPaneTextField('PAtoAllLinkUrl', {
                  label: "כתובת הקישור"
                }),
                PropertyPaneCheckbox('PAtoAllLinkNewTab', {
                  text: "פתיחה בטאב חדש"
                }),
              ]
            },
            {
              groupName: "רכיב פניות פעילות שלי - כללי",
              groupFields: [
                PropertyPaneTextField('INtitle', {
                  label: "כותרת",
                }),
                PropertyPaneTextField('INlist', {
                  label: "רשימה",
                  description: "קישור יחסי לרשימת מסמכים"
                })
              ]
            },
            {
              groupName: "קישור - הוספת פניה",
              groupFields: [
                PropertyPaneTextField('INnewInqTitle', {
                  label: "כותרת הקישור",
                }),
                PropertyPaneTextField('INnewInqUrl', {
                  label: "כתובת הקישור"
                }),
                PropertyPaneCheckbox('INnewInqNewTab', {
                  text: "פתיחה בטאב חדש"
                }),
              ]
            },
            {
              groupName: "קישור - לכל הפניות שלי",
              groupFields: [
                PropertyPaneTextField('INtoAllLinkTitle', {
                  label: "כותרת הקישור",
                }),
                PropertyPaneTextField('INtoAllLinkUrl', {
                  label: "כתובת הקישור"
                }),
                PropertyPaneCheckbox('INtoAllLinkNewTab', {
                  text: "פתיחה בטאב חדש"
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
