import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import AllMyInquiries from './components/AllMyInquiries';
import { IAllMyInquiriesProps } from './components/IAllMyInquiriesProps';

export interface IAllMyInquiriesWebPartProps {
  title: string;
  list:string;
  newInqTitle:string;
  newInqLinkUrl:string;
  newInqLinkNewTab:boolean;
}

export default class AllMyInquiriesWebPart extends BaseClientSideWebPart<IAllMyInquiriesWebPartProps> {

  
  public render(): void {
    const element: React.ReactElement<IAllMyInquiriesProps> = React.createElement(
      AllMyInquiries,
      {
        title: this.properties.title,
        list:this.properties.list,
        newInqTitle:this.properties.newInqTitle,
        newInqLinkUrl:this.properties.newInqLinkUrl,
        newInqLinkNewTab:this.properties.newInqLinkNewTab,
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
    return {
      pages: [
        {
          header: {
            description: "כל הפניות הפעילות שלי"
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
          ]
        }
      ]
    };
  }
}
