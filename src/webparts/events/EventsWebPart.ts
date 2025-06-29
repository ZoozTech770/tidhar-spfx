import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import Projects from '../projects/components/Projects';
import { IProjectsProps } from '../projects/components/IProjectsProps';

export interface IEventsWebPartProps {
  // Projects section
  PRtitle: string;
  PRlist: string;
}

export default class EventsWebPart extends BaseClientSideWebPart<IEventsWebPartProps> {


  public render(): void {
    const element: React.ReactElement<IProjectsProps> = React.createElement(
      Projects,
      {
        title: this.properties.PRtitle,
        list: this.properties.PRlist,
        projectPageTitle: 'פרטי פרויקט',
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
              groupName: 'פרויקטים - כללי',
              groupFields: [
                PropertyPaneTextField('PRtitle', {
                  label: 'כותרת',
                }),
                PropertyPaneTextField('PRlist', {
                  label: 'רשימה',
                  description: 'קישור יחסי לרשימת פרויקטים'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
