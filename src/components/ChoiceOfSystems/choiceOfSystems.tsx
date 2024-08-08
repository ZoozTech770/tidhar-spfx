import * as React from 'react';
import { SystemListItem } from '../../interfaces/ISystemListItem';
import classes from './choiceOfSystems.module.scss';
import 'swiper/swiper-bundle.css';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import './systemsSlider.scss';
import { useState } from 'react';
import useWindowSizeListener from '../../util/useWindowSizeListener';

type ChoiceOfSystemsProps = {
    closeSystemModal: Function;
    systemList: SystemListItem[];
    systemPopupRef: React.MutableRefObject<HTMLDivElement>;
    onAllSystemButtonClick: Function;
    unfloat?: boolean;
}

const ArrowRight = require('../../assets/ArrowRight.svg');
const closeIcon = require('../../assets/icons/closeIcon-green.svg');

const ChoiceOfSystems = ({ systemList, systemPopupRef, closeSystemModal, onAllSystemButtonClick, unfloat }: ChoiceOfSystemsProps) => {

    const { isDesktopView } = useWindowSizeListener();
    const [expanded, setExpanded] = useState(false);

    const onChooseSystemsClick = () => {
        onAllSystemButtonClick();
    }

    const ToggleExpand = () => {
        setExpanded(!expanded)
    }

    if (systemList)
        return (
            <div className={`${classes.darkWrapper} ${unfloat && classes.unfloat}`}>
                <div className={classes.choiceOfSystemsContainer} ref={systemPopupRef}>
                    <div className={classes.mobileChoiseOfSystemHeader}>
                        <h3>המערכות שלי</h3>
                        <button className={classes.closeBtn}><img src={closeIcon} alt="סגירה" onClick={() => closeSystemModal()} /></button>
                    </div>
                    <div className={`${classes.choiceOfSystems}  ${unfloat && classes.unfloat}`}>
                        {isDesktopView && <h3>המערכות שלי</h3>}
                        <div className={classes.continerSlider}>
                            {systemList.length > 6 ?
                                <>
                                    <button id="prevArticleButton" className='navigationButtonSystems prev'><img src={ArrowRight} alt="הקודם" /></button>
                                    <Swiper
                                        className='systems-slider'
                                        enabled={systemList.length > 6}
                                        slidesPerView={systemList.length > 6 ? 6 : systemList.length}
                                        spaceBetween={18}
                                        loop={systemList.length > 6}
                                        dir='rtl'
                                        modules={[Navigation]}
                                        effect='fade'
                                        breakpoints={{
                                            430: {
                                                navigation: { enabled: true, nextEl: '.navigationButtonSystems.next', prevEl: '.navigationButtonSystems.prev' },
                                            }
                                        }}
                                    >
                                        {systemList.map((system, i) => {
                                            return <SwiperSlide key={i}>
                                                <a className={classes.system} href={system.Url} target={system.OpenURLInNewTab ? '_blank' : '_self'} data-interception="off">
                                                    {system.Icon && <img src={system.Icon.UrlLaptop}></img>}
                                                    <span title={system.Title}>{system.Title}</span>
                                                </a>
                                            </SwiperSlide>
                                        })}
                                    </Swiper>
                                    <button id="nextArticleButton" className='navigationButtonSystems next'><img src={ArrowRight} alt="הבא" /></button>
                                </>
                                :
                                <div className={classes.systemsFlexContainer}>
                                    {systemList.map((system, i) => (
                                        <a className={classes.system} href={system.Url} target={system.OpenURLInNewTab ? '_blank' : '_self'} data-interception="off">
                                            {system.Icon && <img src={system.Icon.UrlLaptop}></img>}
                                            <span>{system.Title}</span>
                                        </a>
                                    ))}
                                </div>
                            }
                        </div>

                        <div className={classes.mobileSystemsContainer}>
                            {systemList.slice(0, expanded ? systemList.length : 3).map(system => (
                                <a className={classes.system} href={system.Url} target={system.OpenURLInNewTab ? '_blank' : '_self'} data-interception="off">
                                    {system.Icon && <img src={system.Icon.UrlLaptop}></img>}
                                    <span title={system.Title}>{system.Title}</span>
                                </a>
                            ))}
                        </div>

                        <div className={classes.footer}>
                            {!isDesktopView && systemList.length > 3 && <button className={classes.btnExpand} onClick={ToggleExpand}>{expanded ? `צמצום תצוגה` : `הרחבת תצוגה`}</button>}
                            <button className={classes.btnChoiceOfSystems} onClick={onChooseSystemsClick}>עריכת תצוגה</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    return null;
}
export default ChoiceOfSystems;


