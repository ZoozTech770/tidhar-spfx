
import { BaseApplicationCustomizer } from '@microsoft/sp-application-base';
import "../../fonts/font.scss";
import "./overrideFonts.css"
/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IHeaderExtApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class HeaderExtApplicationCustomizer
  extends BaseApplicationCustomizer<IHeaderExtApplicationCustomizerProperties> {
  public async onInit(): Promise<void> { }
}
