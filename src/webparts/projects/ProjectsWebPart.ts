import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import Projects from './components/Projects';
import { IProjectsProps } from './components/IProjectsProps';

export interface IProjectsWebPartProps {
  title: string;
  list: string;
  projectPageTitle:string;
}

export default class ProjectsWebPart extends BaseClientSideWebPart<IProjectsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IProjectsProps> = React.createElement(
      Projects,
      {
        title: this.properties.title,
        list: this.properties.list,
        projectPageTitle:this.properties.title,
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
              groupName: 'כללי',
              groupFields: [
                PropertyPaneTextField('title', {
                  label: 'כותרת'
                }),
                PropertyPaneTextField('list', {
                  label: 'רשימה',
                  description:'קישור יחסי לרשימת פרוייקטים'
                }),
              ]
            },
            {
              groupName: 'קישור לדף פרוייקט',
              groupFields: [
                PropertyPaneTextField('projectPageTitle', {
                  label: 'כותרת הקישור'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
