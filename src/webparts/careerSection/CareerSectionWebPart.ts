import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { ValidationsService } from '../../services/ValidationsService';
import CareerSection from './components/CareerSection';
import { ICareerSectionProps } from './components/ICareerSectionProps';
import { PropertyFieldNumber } from '@pnp/spfx-property-controls';

export interface ICareerSectionWebPartProps {
  //title
  title: string;
  //job section 
  Jtitle: string;
  Jlist: string;
  JtoAllLinkTitle: string;
  JtoAllLinkUrl: string;
  JtoAllLinkNewTab: boolean;
  jjobPage: string;
  //bring friends
  BFtitle: string;
  BFdescription: string;
  BFbuttonText: string;
  BFbuttonLink: string;
  BFbuttonNewTab: boolean;
  //thanks
  Ttitle: string;
  Tlist: string;
  TtoAllLinkTitle: string;
  TtoAllLinkUrl: string;
  TtoAllLinkNewTab: boolean;
  //new Employees
  NEtitle: string;
  NErangeOfDays: number;
  NElist:string;
  NEAutoPlayDelay: number;
  NEcardList: string;
  NElogList: string;
  NEtoAllLinkTitle: string,
  NEtoAllLinkUrl: string,
  NEtoAllLinkNewTab: boolean,
  //for all
  context: any;
}

export default class CareerSectionWebPart extends BaseClientSideWebPart<ICareerSectionWebPartProps> {


  public render(): void {
    const element: React.ReactElement<ICareerSectionProps> = React.createElement(
      CareerSection,
      {
        title: this.properties.title,
        jobsProps: {
          title: this.properties.Jtitle,
          list: this.properties.Jlist,
          toAllLinkTitle: this.properties.JtoAllLinkTitle,
          toAllLinkUrl: this.properties.JtoAllLinkUrl,
          toAllLinkNewTab: this.properties.JtoAllLinkNewTab,
          jobPage: this.properties.jjobPage,
          context: this.context
        },
        bringFriendsProps: {
          title: this.properties.BFtitle,
          description: this.properties.BFdescription,
          buttonText: this.properties.BFbuttonText,
          buttonLink: this.properties.BFbuttonLink,
          buttonNewTab: this.properties.BFbuttonNewTab,
        },
        thanksProps: {
          title: this.properties.Ttitle,
          list: this.properties.Tlist,
          toAllLinkTitle: this.properties.TtoAllLinkTitle,
          toAllLinkUrl: this.properties.TtoAllLinkUrl,
          toAllLinkNewTab: this.properties.TtoAllLinkNewTab,
          context: this.context
        },
        newEmployeesProps: {
          title: this.properties.NEtitle,
          rangeOfDays: this.properties.NErangeOfDays,
          list: this.properties.NElist,
          autoPlayDelay: this.properties.NEAutoPlayDelay,
          cardList: this.properties.NEcardList,
          logList: this.properties.NElogList,
          toAllLinkTitle: this.properties.NEtoAllLinkTitle,
          toAllLinkUrl: this.properties.NEtoAllLinkUrl,
          toAllLinkNewTab: this.properties.NEtoAllLinkNewTab,
          context: this.context
        }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
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
              groupName: "קריירה - כללי",
              groupFields: [
                PropertyPaneTextField('title', {
                  label: "כותרת מקטע",
                }),
                PropertyPaneCheckbox('showInAnchors', {
                  text: "האם להציג בתפריט עוגנים",
                  checked: true
                })
              ]
            },
            {
              groupName: "משרות - כללי",
              groupFields: [
                PropertyPaneTextField('Jtitle', {
                  label: "כותרת",
                }),
                PropertyPaneTextField('Jlist', {
                  label: "רשימה",
                  description: "קישור יחסי לרשימת משרות"
                }),
                PropertyPaneTextField('jjobPage', {
                  label: "קישור לדף משרה"
                })
              ]
            },
            {
              groupName: "קישור - לכל המשרות",
              groupFields: [
                PropertyPaneTextField('JtoAllLinkTitle', {
                  label: "כותרת הקישור",
                }),
                PropertyPaneTextField('JtoAllLinkUrl', {
                  label: "כתובת הקישור"
                }),
                PropertyPaneCheckbox('JtoAllLinkNewTab', {
                  text: "פתיחה בטאב חדש"
                }),
              ]
            },
            {
              groupName: "חבר מביא חבר - כללי",
              groupFields: [
                PropertyPaneTextField('BFtitle', {
                  label: "כותרת",
                }),
                PropertyPaneTextField('BFdescription', {
                  label: "תיאור"
                })
              ]
            },
            {
              groupName: "חבר מביא חבר - כפתור",
              groupFields: [
                PropertyPaneTextField('BFbuttonText', {
                  label: "כותרת הכפתור",
                  value: "חבר מביא חבר"
                }),
                PropertyPaneTextField('BFbuttonLink', {
                  label: "כתובת הקישור"
                }),
                PropertyPaneCheckbox('BFbuttonNewTab', {
                  text: "פתיחה בטאב חדש"
                }),
              ]
            },
            {
              groupName: "מובילים בשירות - כללי",
              groupFields: [
                PropertyPaneTextField('Ttitle', {
                  label: "כותרת",
                }),
                PropertyPaneTextField('Tlist', {
                  label: "רשימה",
                  description: "קישור יחסי לרשימת מכתבי תודה"
                })
              ]
            },
            {
              groupName: "מובילים בשירות - קישור - לכל המכתבים",
              groupFields: [
                PropertyPaneTextField('TtoAllLinkTitle', {
                  label: "כותרת הקישור",
                }),
                PropertyPaneTextField('TtoAllLinkUrl', {
                  label: "כתובת הקישור"
                }),
                PropertyPaneCheckbox('TtoAllLinkNewTab', {
                  text: "פתיחה בטאב חדש"
                }),
              ]
            },
            {
              groupName: 'עובדים חדשים - כללי',
              groupFields: [
                PropertyPaneTextField('NEtitle', {
                  label: 'כותרת',
                }),
                PropertyPaneTextField('NErangeOfDays', {
                  label: 'טווח ימים להצגת עובדים חדשים',
                  onGetErrorMessage: ValidationsService.validateNumber.bind(this),
                  description: 'מספר ימים אחורה'
                }),
                PropertyPaneTextField('NElist', {
                  label: 'list',
                  description: 'רשימה'
                }),
                PropertyFieldNumber('NEAutoPlayDelay', {
                  label: 'זמן מעבר בין סליידים',
                  description: '(יש לבחור 0 על מנת לבטל את המעבר האוטומטי) בשניות',
                  value: this.properties.NEAutoPlayDelay,
                  minValue: 0,
                  key: 'NEAutoPlayDelay'
                })
              ]
            },
            {
              groupName: "קישור - לכל העובדים החדשים",
              groupFields: [
                PropertyPaneTextField('NEtoAllLinkTitle', {
                  label: "כותרת הקישור",
                }),
                PropertyPaneTextField('NEtoAllLinkUrl', {
                  label: "כתובת הקישור"
                }),
                PropertyPaneCheckbox('NEtoAllLinkNewTab', {
                  text: "פתיחה בטאב חדש"
                }),
              ]
            },
            {
              groupName: "עובדים חדשים - רשימות עזר",
              groupFields: [
                PropertyPaneTextField('NEcardList', {
                  label: "רשימת כרטיסי ברכה",
                  description: "קישור יחסי לרשימת כרטיסי ברכה"
                }),
                PropertyPaneTextField('NElogList', {
                  label: "רשימת תיעוד שליחת ברכה",
                  description: "קישור יחסי לרשימת לוג שליחת ברכה"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
