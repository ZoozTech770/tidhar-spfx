import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import Thanks from './components/Thanks';
import { IThanksProps } from './components/IThanksProps';

export interface IThanksWebPartProps {
  title: string;
  list:string;
  toAllLinkTitle:string;
  toAllLinkUrl:string;
  toAllLinkNewTab:boolean;
}

export default class ThanksWebPart extends BaseClientSideWebPart<IThanksWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IThanksProps> = React.createElement(
      Thanks,
      {
        title: this.properties.title,
        list:this.properties.list,
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
                  description:"קישור יחסי לרשימת מכתבי תודה"
                })
              ]
            },
            {
              groupName: "קישור - לכל המכתבים",
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
