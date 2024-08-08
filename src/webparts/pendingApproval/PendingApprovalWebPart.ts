import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import PendingApproval from './components/PendingApproval';
import { IPendingApprovalProps } from './components/IPendingApprovalProps';
import { PendingApprovalService } from '../../services/PendingApprovalService';

export interface IPendingApprovalWebPartProps {
  title: string;
  list:string;
  list2:string;
  toAllLinkTitle:string;
  toAllLinkUrl:string;
  toAllLinkNewTab:boolean;
}

export default class PendingApprovalWebPart extends BaseClientSideWebPart<IPendingApprovalWebPartProps> {

  public render():void{
   
    const element: React.ReactElement<IPendingApprovalProps> = React.createElement(
      PendingApproval,
      {
        title: this.properties.title,
        list:this.properties.list,
        list2:this.properties.list2,
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
                  label: "כותרת"
                }),
                PropertyPaneTextField('list', {
                  label: "רשימה",
                  description:"קישור יחסי לרשימת ניהול בקשות"
                })
                ,
                PropertyPaneTextField('list2', {
                  label: "2 רשימה",
                  description:"קישור יחסי לרשימת טפסים"
                })
              ]
            },
            {
              groupName: "קישור - לכל הבקשות",
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
