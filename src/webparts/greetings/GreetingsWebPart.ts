import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {ValidationsService} from '../../services/ValidationsService';
import Greetings from './components/Greetings';
import { IGreetingsProps } from './components/IGreetingsProps';
import { PropertyFieldNumber } from '@pnp/spfx-property-controls';

export interface IGreetingsWebPartProps {
  title: string;
  list: string;
  logList: string;
  typeList: string;
  cardList: string;
  sendGreetingTitle: string;
  toAllLinkTitle:string;
  toAllLinkUrl:string;
  toAllLinkNewTab:boolean;
  showAsSlider:boolean;
  autoPlayDelay: number;
}

export default class GreetingsWebPart extends BaseClientSideWebPart<IGreetingsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IGreetingsProps> = React.createElement(
      Greetings,
      {
        title: this.properties.title,
        list: this.properties.list,
        logList: this.properties.logList,
        typeList: this.properties.typeList,
        cardList:  this.properties.cardList,
        sendGreetingTitle: this.properties.sendGreetingTitle,
        toAllLinkTitle:this.properties.toAllLinkTitle,
        toAllLinkUrl:this.properties.toAllLinkUrl,
        toAllLinkNewTab:this.properties.toAllLinkNewTab,
        showAsSlider:this.properties.showAsSlider,
        context:this.context,
        autoPlayDelay: this.properties.autoPlayDelay
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
              groupName: "כללי",
              groupFields: [
                PropertyPaneTextField('title', {
                  label: 'כותרת',
                }),
                PropertyPaneCheckbox('showInAnchors', {
                  text: "האם להציג בתפריט עוגנים",
                  checked: true
                }),
                PropertyPaneTextField('list', {
                  label: "רשימה",
                  description:"קישור יחסי לרשימת אירועים"
                }),
                PropertyPaneTextField('sendGreetingTitle', {
                  label: 'טקסט שלח ברכה',
                }),
                PropertyPaneCheckbox('showAsSlider', {
                  text: "האם להציג כסליידר",
                  checked: true
                }),
                PropertyFieldNumber('autoPlayDelay', {
                  label: "מהירות הפעלה של הסליידר",
                  description:"בשניות",
                  value: this.properties.autoPlayDelay,
                  minValue: 1,
                  key: 'autoPlayDelay'
                }),
              ]
            },
            {
              groupName: "קישור - לכל הברכות והאיחולים",
              groupFields: [
                PropertyPaneTextField('toAllLinkTitle', {
                  label: "כותרת הקישור",
                }),
                PropertyPaneTextField('toAllLinkUrl', {
                  label: "כתובת הקישור"
                }),
                PropertyPaneCheckbox('toAllLinkNewTab', {
                  text: "פתיחה בטאב חדש"
                }),
              ]
            },
            {
              groupName: "רשימות עזר",
              groupFields: [
                PropertyPaneTextField('cardList', {
                  label: "רשימת כרטיסי ברכה",
                  description:"קישור יחסי לרשימת כרטיסי ברכה"
                }),
                PropertyPaneTextField('typeList', {
                  label: "רשימת סוגי אירועים",
                  description:"קישור יחסי לרשימת סוגי אירועים"
                }),
                PropertyPaneTextField('logList', {
                  label: "רשימת תיעוד שליחת ברכה",
                  description:"קישור יחסי לרשימת לוג שליחת ברכה"
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
