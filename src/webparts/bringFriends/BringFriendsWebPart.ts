import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import BringFriends from './components/BringFriends';
import { IBringFriendsProps } from './components/IBringFriendsProps';

export interface IBringFriendsWebPartProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  buttonNewTab: boolean;
}

export default class BringFriendsWebPart extends BaseClientSideWebPart<IBringFriendsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IBringFriendsProps> = React.createElement(
      BringFriends,
      {
        title:this.properties.title,
        description: this.properties.description,
        buttonText: this.properties.buttonText,
        buttonLink: this.properties.buttonLink,
        buttonNewTab: this.properties.buttonNewTab,
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
               PropertyPaneTextField('description', {
                 label: "תיאור"
               })
             ]
           },
           {
             groupName: "כפתור",
             groupFields: [
              PropertyPaneTextField('buttonText', {
                label: "כותרת הכפתור"
              }),
              PropertyPaneTextField('buttonLink', {
                label: "כתובת הקישור"
              }),
              PropertyPaneCheckbox('buttonNewTab', {
                text: "פתיחה בטאב חדש"
              })
             ]
           }
         ]
       }
     ]
   };
  }
}
