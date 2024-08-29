import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneCheckbox,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import SearchContacts from './components/SearchContacts';
import { ISearchContactsProps } from './components/ISearchContactsProps';

export interface ISearchContactsWebPartProps {
  placeHolder: string;
  buttonText: string;
  resultPageUrl: string;
}

export default class SearchContactsWebPart extends BaseClientSideWebPart<ISearchContactsWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit();
  }
  
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  public render(): void {
    const element: React.ReactElement<ISearchContactsProps> = React.createElement(
      SearchContacts,
      {
        placeHolder: this.properties.placeHolder,
        buttonText: this.properties.buttonText,
        resultPageUrl: this.properties.resultPageUrl
      }
    );
    let siteHeader = document.getElementById("spSiteHeader");
    ReactDom.render(element, this.domElement);
    if (window.innerWidth <= 430 && siteHeader) {
      siteHeader.insertAdjacentElement('beforeend', this.domElement);
    }
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
                PropertyPaneTextField('placeHolder', {
                  label: "טקסט מניע לתיבת החיפוש",
                }),
                PropertyPaneTextField('buttonText', {
                  label: "טקסט לכפתור חיפוש",
                }),
                PropertyPaneCheckbox('showInAnchors', {
                  text: "האם להציג בתפריט עוגנים",
                  checked: false
                }),
                PropertyPaneTextField('resultPageUrl', {
                  label: "קישור לדף תוצאות חיפוש"
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
