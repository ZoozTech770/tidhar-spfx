import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import CalendarPanel from './components/CalendarPanel';
import { ICalendarPanelProps } from './components/ICalendarPanelProps';

export interface ICalendarWebPartProps {
  list: string;
  eventPage: string;
}

export default class CalendarWebPart extends BaseClientSideWebPart<ICalendarWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ICalendarPanelProps> = React.createElement(
      CalendarPanel,
      {
        list: this.properties.list,
        userEmail: this.context.pageContext.user.email,
        eventPage: this.properties.eventPage,
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
            description: "מאפייני רכיב לוח אירועים"
          },
          groups: [
            {
              groupName: "כללי",
              groupFields: [
                PropertyPaneTextField('list', {
                  label: "רשימה",
                  description: "קישור יחסי לרשימת אירועים"
                }),
                PropertyPaneTextField('eventPage', {
                  label: "קישור לדף אירוע"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
