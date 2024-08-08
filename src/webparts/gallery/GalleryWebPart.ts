import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import Gallery from './components/Gallery';
import { IGalleryProps } from './components/IGalleryProps';

export interface IGalleryWebPartProps {
  title:string;
  pictureLibrary:string;
  toAllLinkTitle:string;
  toAllLinkUrl:string;
  toAllLinkNewTab:boolean;
  context:any;
}

export default class GalleryWebPart extends BaseClientSideWebPart<IGalleryWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IGalleryProps> = React.createElement(
      Gallery,
      {
        title:this.properties.title,
        pictureLibrary:this.properties.pictureLibrary,
        toAllLinkTitle:this.properties.toAllLinkTitle,
        toAllLinkUrl:this.properties.toAllLinkUrl,
        toAllLinkNewTab:this.properties.toAllLinkNewTab,
        context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }


  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return  {
      pages: [
        {
          groups: [
            {
              groupName: "כללי",
              groupFields: [
                PropertyPaneTextField('title', {
                  label: "כותרת",
                }),
                PropertyPaneTextField('pictureLibrary', {
                  label: "רשימה",
                  description:"קישור יחסי לרשימת גלריות"
                }),
                PropertyPaneCheckbox('showInAnchors', {
                  text: "האם להציג בתפריט עוגנים",
                  checked: true
                }),
              ]
            },
            {
              groupName: "קישור - לכל הגלריות",
              groupFields: [
                PropertyPaneTextField('toAllLinkTitle', {
                  label: "כותרת הקישור",
                }),
                PropertyPaneTextField('toAllLinkUrl', {
                  label: "כתובת הקישור"
                }),
                PropertyPaneCheckbox('toAllLinkNewTab', {
                  text: "פתיחה בחלונית חדשה"
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
