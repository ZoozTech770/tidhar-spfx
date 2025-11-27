import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import AllPendingApproval from './components/AllPendingApproval';
import { IAllPendingApprovalProps } from './components/IAllPendingApprovalProps';

export interface IAllPendingApprovalWebPartProps {
  title: string;
  list: string;
  list2: string;
  /** Optional: HR approvers list (relative URL to zooz_hr_approvers) */
  hrApproversList?: string;
  /** Optional: HR requests list (relative URL to zooz_hr_allRequests) */
  hrRequestsList?: string;
}

export default class AllPendingApprovalWebPart extends BaseClientSideWebPart<IAllPendingApprovalWebPartProps> {


  public render(): void {
    const element: React.ReactElement<IAllPendingApprovalProps> = React.createElement(
      AllPendingApproval,
      {
        title: this.properties.title,
        list: this.properties.list,
        list2: this.properties.list2,
        hrApproversList: this.properties.hrApproversList,
        hrRequestsList: this.properties.hrRequestsList,
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
            description: "כל הפניות הממתינות לאישורי"
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
                }),
                PropertyPaneTextField('list2', {
                  label: "2 רשימה",
                  description:"קישור יחסי לרשימת טפסים"
                }),
                PropertyPaneTextField('hrApproversList', {
                  label: "HR רשימת מאשרים",
                  description: "קישור יחסי לרשימת zooz_hr_approvers"
                }),
                PropertyPaneTextField('hrRequestsList', {
                  label: "HR רשימת בקשות",
                  description: "קישור יחסי לרשימת zooz_hr_allRequests"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
