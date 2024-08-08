import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import MyInquiries from './components/MyInquiries';
import { IMyInquiriesProps } from './components/IMyInquiriesProps';

export interface IMyInquiriesWebPartProps {
  title: string;
  list:string;
  newInqTitle:string;
  newInqLinkUrl:string;
  newInqLinkNewTab:boolean;
  toAllLinkTitle:string;
  toAllLinkUrl:string;
  toAllLinkNewTab:boolean;
}

export default class MyInquiriesWebPart extends BaseClientSideWebPart<IMyInquiriesWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IMyInquiriesProps> = React.createElement(
      MyInquiries,
      {
        title: this.properties.title,
        list:this.properties.list,
        newInqTitle:this.properties.newInqTitle,
        newInqLinkUrl:this.properties.newInqLinkUrl,
        newInqLinkNewTab:this.properties.newInqLinkNewTab,
        toAllLinkTitle:this.properties.toAllLinkTitle,
        toAllLinkUrl:this.properties.toAllLinkUrl,
        toAllLinkNewTab:this.properties.toAllLinkNewTab,
        context:this.context
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
    return  {
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
                  label: "כותרת"
                }),
                PropertyPaneTextField('list', {
                  label: "רשימה",
                  description:"קישור יחסי לרשימת טפסים"
                })
              ]
            },
            {
              groupName: "קישור - הוספת פניה",
              groupFields: [
                PropertyPaneTextField('newInqTitle', {
                  label: "כותרת הקישור"
                }),
                PropertyPaneTextField('newInqUrl', {
                  label: "כתובת הקישור"
                }),
                PropertyPaneCheckbox('newInqNewTab', {
                  text: "פתיחה בטאב חדש"
                }),
              ]
            },
            {
              groupName: "קישור - לכל הפניות",
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
            }
          ]
        }
      ]
    };
  }
}
