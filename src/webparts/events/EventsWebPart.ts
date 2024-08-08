import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import Events from './components/Events';
import { IEventsProps } from './components/IEventsProps';

export interface IEventsWebPartProps {
  list:string;
  eventPage:string;
}

export default class EventsWebPart extends BaseClientSideWebPart<IEventsWebPartProps> {


  public render(): void {
    const element: React.ReactElement<IEventsProps> = React.createElement(
      Events,
      {
        list:this.properties.list,
        userEmail:this.context.pageContext.user.email,
        eventPage:this.properties.eventPage,
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
                PropertyPaneTextField('list', {
                  label: "רשימה",
                  description:"קישור יחסי לרשימת אירועים"
                })
              ]
            },
            {
              groupName: "קישור לדף אירוע",
              groupFields: [
                PropertyPaneTextField('eventPage', {
                  label: "כתובת הקישור"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
