import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import AnchorsNav from './components/AnchorsNav';
import { IPropertyPaneConfiguration, PropertyPaneCheckbox } from '@microsoft/sp-property-pane';


export interface IAnchorsNavWebPartProps {
}

export default class AnchorsNavWebPart extends BaseClientSideWebPart<IAnchorsNavWebPartProps> {

  public render(): void {
    if(window.innerWidth < 430 && location.hash==""){
       location.hash="articles";
       location.reload();
    }
    
    const element: React.ReactElement = React.createElement(
      AnchorsNav,
      {
        context: this.context
      }
    );
    let siteHeader = document.getElementById("spSiteHeader");
    ReactDom.render(element, this.domElement);
    siteHeader.insertAdjacentElement('beforeend', this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
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
                PropertyPaneCheckbox('showInAnchors', {
                  text: "האם להציג בתפריט עוגנים",
                  checked: false
                }),
              ]
            }
          ]
        }
      ]
    };
  }

}
