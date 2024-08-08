
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { createElement } from 'react';
import * as ReactDom from 'react-dom';
import FooterUI from '../../components/FooterUI/footerUI';
import { IconLinkType } from '../../interfaces/Types';
/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IFooterExtApplicationCustomizerProperties {
  // This is an example; replace with your own property
  ListURL: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class FooterExtApplicationCustomizer
  extends BaseApplicationCustomizer<IFooterExtApplicationCustomizerProperties> {
  
  public async getListItems() {
    const sp = spfi().using(SPFx(this.context));
    const FooterLoweritems: any[] = await sp.web.lists.getByTitle("lstFooterLowerLinksList").items();
    return FooterLoweritems;
  }

  public async onInit(): Promise<void> {

    const items = await this.getListItems();
    const socialLinks: IconLinkType[] = items.map(item => ({ Url: item.eldURL.Url, Icon: { UrlLaptop: item.eldIcon.Url, Alt: item.eldIcon.Description }, OpenURLInNewTab: item.eldOpenURLInNewTab }))

    this.context.placeholderProvider.changedEvent.add(this, () => this._renderPlaceHolders(socialLinks));
    return Promise.resolve();
  }
  private insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
  private _renderPlaceHolders(socialLinks: IconLinkType[]): void {
    
     let footer = createElement(FooterUI, {
      socialLinks: socialLinks,
     });
     const tempDiv = document.createElement("div");
     ReactDom.render(footer, tempDiv);
     let commentsWrapper= document.getElementById("CommentsWrapper");
     if(commentsWrapper!=null)
       this.insertAfter(commentsWrapper,tempDiv);
     else
       document.querySelector('[data-automation-id="Canvas"]').insertAdjacentElement('beforeend',tempDiv);
  }
}
