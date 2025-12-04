import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import JobsPanel from './components/JobsPanel';
import { IJobsPanelProps } from './components/IJobsPanelProps';

export interface IJobsWebPartProps {
  title: string;
  list: string;
  toAllLinkTitle:string;
  toAllLinkUrl:string;
  toAllLinkNewTab:boolean;
  jobPage:string;
}

export default class JobsWebPart extends BaseClientSideWebPart<IJobsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IJobsPanelProps> = React.createElement(
      JobsPanel,
      {
        title: this.properties.title,
        list: this.properties.list,
        toAllLinkTitle: this.properties.toAllLinkTitle,
        toAllLinkUrl: this.properties.toAllLinkUrl,
        toAllLinkNewTab: this.properties.toAllLinkNewTab,
        jobPage: this.properties.jobPage,
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
                  description:"קישור יחסי לרשימת משרות"
                }),
                PropertyPaneTextField('jobPage', {
                  label: "קישור לדף משרה"
                })
              ]
            },
            {
              groupName: "קישור - לכל המשרות",
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
