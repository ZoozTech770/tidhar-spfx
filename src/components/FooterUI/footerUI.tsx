import * as React from 'react';
import { IconLinkType } from '../../interfaces/Types';
import classes from './footerUI.module.scss';

type IFooterProps = {
    socialLinks: IconLinkType[];
}
const FooterUI: React.FC<IFooterProps> = (props) => {
    const { socialLinks } = props;
    return (<div className={classes.footer}>
        <div className={classes.links}>
            {socialLinks.map((link) => {
                return <a href={link.Url} target={link.OpenURLInNewTab ? "_blank" : "_self"} data-interception="off">
                    <img src={link.Icon.UrlLaptop} alt={""} />
                </a>
            })}
        </div>
    </div>);

}
export default FooterUI;


