import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import PendingApprovalPanel from './components/PendingApprovalPanel';
import { IPendingApprovalPanelProps } from './components/IPendingApprovalPanelProps';

export interface IPendingApprovalWebPartProps {
  title: string;
  list: string;
  list2: string;
  /** Optional: HR approvers list (relative URL to zooz_hr_approvers) */
  hrApproversList?: string;
  /** Optional: HR requests list (relative URL to zooz_hr_allRequests) */
  hrRequestsList?: string;
  /** Optional: Internal Mobility approvers list (relative URL to zooz_mobility_approvers) */
  mobilityApproversList?: string;
  /** Optional: Internal Mobility requests list (relative URL to lstEmployeeMobilityForm) */
  mobilityRequestsList?: string;
  toAllLinkTitle: string;
  toAllLinkUrl: string;
  toAllLinkNewTab: boolean;
}

export default class PendingApprovalWebPart extends BaseClientSideWebPart<IPendingApprovalWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPendingApprovalPanelProps> = React.createElement(
      PendingApprovalPanel,
      {
        title: this.properties.title,
        list: this.properties.list,
        list2: this.properties.list2,
        hrApproversList: this.properties.hrApproversList,
        hrRequestsList: this.properties.hrRequestsList,
        mobilityApproversList: this.properties.mobilityApproversList,
        mobilityRequestsList: this.properties.mobilityRequestsList,
        toAllLinkTitle: this.properties.toAllLinkTitle,
        toAllLinkUrl: this.properties.toAllLinkUrl,
        toAllLinkNewTab: this.properties.toAllLinkNewTab,
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
                }),
                PropertyPaneTextField('hrApproversList', {
                  label: "HR רשימת מאשרים",
                  description: "קישור יחסי לרשימת zooz_hr_approvers"
                }),
                PropertyPaneTextField('hrRequestsList', {
                  label: "HR רשימת בקשות",
                  description: "קישור יחסי לרשימת zooz_hr_allRequests"
                }),
                PropertyPaneTextField('mobilityApproversList', {
                  label: "ניוד פנימי - רשימת מאשרים",
                  description: "קישור יחסי לרשימת zooz_mobility_approvers"
                }),
                PropertyPaneTextField('mobilityRequestsList', {
                  label: "ניוד פנימי - רשימת בקשות",
                  description: "קישור יחסי לרשימת lstEmployeeMobilityForm"
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
