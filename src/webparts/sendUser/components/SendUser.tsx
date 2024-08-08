import * as React from 'react';
import styles from './SendUser.module.scss';
import { ISendUserProps } from './ISendUserProps';


export default class SendUser extends React.Component<ISendUserProps, {}> {

  componentDidMount() {
    let siteRel = window.location.pathname
    const acupdate = JSON.stringify({
      account: [
        {
          email: this.props.context.pageContext["user"].email,
          userId: this.props.context.pageContext.legacyPageContext["userId"],
          pageId: new URLSearchParams(window.location.search).get("PageID") ? new URLSearchParams(window.location.search).get("PageID") : new URLSearchParams(window.location.search).get("pageID"),
          pageName: siteRel.split("/")[siteRel.split("/").length - 1].split(".")[0],
          title: document.title,
        }
      ]
    });
    const req = new XMLHttpRequest();
    req.open("POST", this.props.description, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(acupdate);
  }

  public render(): React.ReactElement<ISendUserProps> {
    const { description, hasTeamsContext } = this.props;

    return (
      null
    );
  }
}