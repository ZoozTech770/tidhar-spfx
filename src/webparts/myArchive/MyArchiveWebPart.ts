import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'MyArchiveWebPartStrings';
import MyArchive from './components/MyArchive';
import { IMyArchiveProps } from './components/IMyArchiveProps';

export interface IMyArchiveWebPartProps {
  title: string;
  list:string;
}

export default class MyArchiveWebPart extends BaseClientSideWebPart<IMyArchiveWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IMyArchiveProps> = React.createElement(
      MyArchive,
      {
        title: this.properties.title,
        list:this.properties.list,
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
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: "כותרת"
                }),
                PropertyPaneTextField('list', {
                  label: "רשימה",
                  description:"קישור יחסי לרשימת טפסים"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
