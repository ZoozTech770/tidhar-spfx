import { ISPFXContext } from "@pnp/sp";

export interface ISendUserProps {
  description: string;
  context: ISPFXContext;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}
