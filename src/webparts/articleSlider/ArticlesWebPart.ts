import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneCheckbox,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import ArticleSlider from './components/ArticleSlider';
import { IArticleSliderProps } from './components/IArticleSliderProps';
import { ValidationsService } from '../../services/ValidationsService';
export interface IArticleSliderWebPartProps {
  title: string;
  articlesListUrl: string;
  allArticlesTitle: string;
  allArticlesUrl: string;
  allArticlesOpenInNewTab: boolean;
  sliderListUrl: string;
  articlePage:string;
  numOfItemsToDisplay: string;
  autoPlayDelay: string;
  numOfItemsToDisplayMobile: string;
}

export default class ArticleSliderWebPart extends BaseClientSideWebPart<IArticleSliderWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IArticleSliderProps> = React.createElement(
      ArticleSlider,
      {
        title: this.properties.title,
        articlesListUrl: this.properties.articlesListUrl,
        allArticlesTitle: this.properties.allArticlesTitle,
        allArticlesUrl: this.properties.allArticlesUrl,
        allArticlesOpenInNewTab: this.properties.allArticlesOpenInNewTab,
        sliderListUrl: this.properties.sliderListUrl,
        articlePage:this.properties.articlePage,
        numOfItemsToDisplay:this.properties.numOfItemsToDisplay!=null && this.properties.numOfItemsToDisplay!=""?Number(this.properties.numOfItemsToDisplay):0 ,
        autoPlayDelay:this.properties.autoPlayDelay!=null && this.properties.autoPlayDelay!=""?Number(this.properties.autoPlayDelay):5,
        context: this.context,
        numOfItemsToDisplayMobile:this.properties.numOfItemsToDisplayMobile!=null && this.properties.numOfItemsToDisplayMobile!=""?Number(this.properties.numOfItemsToDisplayMobile):0 
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected onInit(): Promise<void> {
    return Promise.resolve();
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
                PropertyPaneCheckbox('showInAnchors', {
                  text: "האם להציג בתפריט עוגנים",
                  checked: true
                }),
                PropertyPaneTextField('articlePage', {
                  label: "קישור לדף אירוע",
                  description: "קישור לדף כתבה"
                }),
              ]
            },
            {
              groupName: "ידיעות",
              groupFields: [
                PropertyPaneTextField('title', {
                  label: "כותרת",
                }),
                PropertyPaneTextField('articlesListUrl', {
                  label: "כתובת קישור לרשימה",
                  description: "קישור יחסי לרשימת ידיעות"
                }),
                PropertyPaneTextField('numOfItemsToDisplayMobile', {
                  label:'מספר פריטים להצגה מובייל',
                  onGetErrorMessage: ValidationsService.validateNumber.bind(this),
                  description: 'בתצוגת דסקטופ יוצגו עד 3 פריטים'
                })
              ]
            },
            {
              groupName: "קישור לכל הידיעות",
              groupFields: [
              PropertyPaneTextField('allArticlesTitle', {
                label: "כותרת קישור",
              }),
              PropertyPaneTextField('allArticlesUrl', {
                label: "כתובת קישור",
              }),
              PropertyPaneCheckbox('allArticlesOpenInNewTab', {
                text: "טאב חדש",
                checked: false
              })]
            },
            {
              groupName: "סליידר ידיעות",
              groupFields: [
                PropertyPaneTextField('sliderListUrl', {
                  label: "כתובת קישור לרשימה",
                  description: "קישור יחסי לרשימת ידיעות"
                }),
                PropertyPaneTextField('numOfItemsToDisplay', {
                  label:"כמות פריטים להצגה",
                  onGetErrorMessage: ValidationsService.validateNumber.bind(this)
                }),
                PropertyPaneTextField('autoPlayDelay', {
                  label: "מספר שניות לדפדוף",
                  onGetErrorMessage: ValidationsService.validateNumber.bind(this)
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
