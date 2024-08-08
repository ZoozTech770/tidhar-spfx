import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import NewEmployees from './components/NewEmployees';
import { INewEmployeesProps } from './components/INewEmployeesProps';
import { ValidationsService } from '../../services/ValidationsService';
import { PropertyFieldNumber } from '@pnp/spfx-property-controls';

export interface INewEmployeesWebPartProps {
  title: string;
  rangeOfDays: number;
  autoPlayDelay: number;
  cardList: string;
  logList: string;
  toAllLinkTitle: string;
  toAllLinkUrl: string;
  toAllLinkNewTab: boolean;
}

export default class NewEmployeesWebPart extends BaseClientSideWebPart<INewEmployeesWebPartProps> {

  public render(): void {
    const element: React.ReactElement<INewEmployeesProps> = React.createElement(
      NewEmployees,
      {
        title: this.properties.title,
        rangeOfDays: this.properties.rangeOfDays,
        cardList: this.properties.cardList,
        logList: this.properties.logList,
        toAllLinkTitle: this.properties.toAllLinkTitle,
        toAllLinkUrl: this.properties.toAllLinkUrl,
        toAllLinkNewTab: this.properties.toAllLinkNewTab,
        autoPlayDelay: this.properties.autoPlayDelay,
        context: this.context
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
            description: 'מאפייני רכיב'
          },
          groups: [
            {
              groupName: 'כללי',
              groupFields: [
                PropertyPaneTextField('title', {
                  label: 'כותרת'
                }),
                PropertyPaneTextField('rangeOfDays', {
                  label: 'טווח ימים להצגת עובדים חדשים',
                  onGetErrorMessage: ValidationsService.validateNumber.bind(this),
                  description: 'מספר ימים אחורה'
                }),
                PropertyFieldNumber('autoPlayDelay', {
                  label: 'זמן מעבר בין סליידים',
                  description: 'בשניות',
                  value: this.properties.autoPlayDelay,
                  key: 'autoPlayDelay'
                })
              ]
            },
            {
              groupName: "קישור - לכל הידיעות",
              groupFields: [
                PropertyPaneTextField('toAllLinkTitle', {
                  label: "כותרת הקישור"
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
                  description: "קישור יחסי לרשימת כרטיסי ברכה"
                }),
                PropertyPaneTextField('logList', {
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
