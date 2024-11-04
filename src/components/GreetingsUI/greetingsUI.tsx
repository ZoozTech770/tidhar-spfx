import * as React from 'react';
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { IGreetingItem } from '../../interfaces/IGreetingItem';
import { IGreetingType } from '../../interfaces/IGreetingType';
import GreetingItem from './GreetingItem/greetingItem';
import classes from './greetingsUI.module.scss';
import 'swiper/swiper-bundle.css';
import { Navigation, Autoplay, Pagination, FreeMode } from 'swiper';
import './greetingSliderUI.scss';
import { LinkType } from '../../interfaces/Types';
import { useRef, useState } from 'react';
import ContainerModel from '../ContainerModel';
import SendGreetingModel from './SendGreetingModel/sendGreetingModel';

type IGreetingsProps = {
    title: string,
    greetingsList: IGreetingItem[],
    greetingTypeList: IGreetingType[],
    autoPlayDelay?: number;
    linkAllGreetings: LinkType,
    sendGreetingsTitle: string,
    onGetGreetingCard: Function,
    onSendGreeting: Function,
    showAsSlider: boolean
}
const ArrowRight = require('../../assets/icons/arrowRight.svg');
const GreetingsUI: React.FC<IGreetingsProps> = (props) => {
    const { title, greetingsList,
        greetingTypeList, autoPlayDelay, linkAllGreetings, onGetGreetingCard, onSendGreeting, sendGreetingsTitle, showAsSlider } = props;

    const [openSendGreetingModel, setOpenSendGreetingModel] = useState<boolean>(false);
    const [mail, setMail] = useState<string>("");
    const [greetingType, setGreetingType] = useState<number>(1);
    const [receiverName, setReceiverName] = useState<string>("");

    const swiperRef = useRef<SwiperRef>(null);

    const onOpenModel = (mail: string, greetingType: number, receiverName: string) => {
        setMail(mail);
        setGreetingType(greetingType);
        setReceiverName(receiverName);
        setOpenSendGreetingModel(true);
    }
    const onCloseModel = () => {
        setOpenSendGreetingModel(false);
    }

    return (
        <div className={classes.greetings} id={"greetings"}>
            <div className={classes.greetingsContiner}>
                <div className={classes.header}>
                    <h2>{title}</h2>
                    {showAsSlider && <a href={linkAllGreetings.Url} target={linkAllGreetings.OpenURLInNewTab ? "_blank" : '_self'} data-interception="off">{linkAllGreetings.Text}</a>}
                </div>
                {showAsSlider ?
                    <div className={classes.sliderContainer}>
                        <div className={classes.desktopSwiper}>
                            <button id="greetingsNavPrev" className={`navigationButtonGreeting prev ${greetingsList.length > 6 ? '' : 'hide'}`}><img src={ArrowRight} alt="הקודם" /></button>
                            <Swiper className='greetings-slider'
                                ref={swiperRef}
                                modules={[Pagination, Navigation, Autoplay]}
                                slidesPerView={6}
                                dir="rtl"
                                initialSlide={1}
                                spaceBetween={20}
                                slidesPerGroup={6}
                                navigation={{ enabled: true, nextEl: '#greetingsNavNext', prevEl: '#greetingsNavPrev', lockClass: "locked" }}
                                pagination={{ enabled: true, dynamicBullets: true, dynamicMainBullets: 3, clickable: true }}
                                autoplay={{ delay: autoPlayDelay ? autoPlayDelay * 1000 : 5000, pauseOnMouseEnter: true, disableOnInteraction: false }}
                            >
                                {greetingsList?.map((item, i) => {
                                    return <SwiperSlide key={i}>
                                        <GreetingItem item={item} greetingTypeList={greetingTypeList} onOpenModel={onOpenModel}></GreetingItem>
                                    </SwiperSlide>

                                })}
                            </Swiper>
                            <button id="greetingsNavNext" className={`navigationButtonGreeting next ${greetingsList.length > 6 ? '' : 'hide'}`}><img src={ArrowRight} alt="הבא" /></button>
                            <a className={classes.allGreetings} href={linkAllGreetings.Url} target={linkAllGreetings.OpenURLInNewTab ? "_blank" : '_self'} data-interception="off">{linkAllGreetings.Text}</a>
                        </div>
                        <div className={classes.mobileSwiper}>
                            <Swiper className='greetings-slider'
                                modules={[FreeMode, Autoplay]}
                                slidesPerView={'auto'}
                                dir="rtl"
                                initialSlide={1}
                                spaceBetween={20}
                                freeMode={true}
                                autoplay={{ delay: autoPlayDelay ? autoPlayDelay * 1000 : 5000, pauseOnMouseEnter: true, disableOnInteraction: false }}
                            >
                                {greetingsList?.map((item, i) => {
                                    return <SwiperSlide key={i}>
                                        <GreetingItem item={item} greetingTypeList={greetingTypeList} onOpenModel={onOpenModel}></GreetingItem>
                                    </SwiperSlide>
                                })}
                            </Swiper>
                            <a className={classes.allGreetings} href={linkAllGreetings.Url} target={linkAllGreetings.OpenURLInNewTab ? "_blank" : '_self'} data-interception="off">{linkAllGreetings.Text}</a>
                        </div>
                    </div>
                    :
                    <div className={classes.flexContainer}>
                        {greetingsList?.map((item, i) => {
                            return (
                                <GreetingItem key={i} item={item} greetingTypeList={greetingTypeList} onOpenModel={onOpenModel}></GreetingItem>
                            )
                        })}
                    </div>}
            </div>
            {openSendGreetingModel && <ContainerModel panelViewOnMobile={true} isOpen={openSendGreetingModel} onClose={onCloseModel} childern={<SendGreetingModel onSendGreeting={onSendGreeting} onGetGreetingCard={onGetGreetingCard} greetingType={greetingType} mail={mail} onclose={onCloseModel} ></SendGreetingModel>} title={`שליחת ברכה ל${receiverName}`} topViewOnMobile={false}></ContainerModel>}

        </div>
    );
}
export default GreetingsUI;


                            // slidesPerView={'auto'}
                            // slidesPerGroup={undefined}
                            // loopedSlides={2}
                            // spaceBetween={20}
                            // loop={true}
                            // dir='rtl'
                            // freeMode={true}
                            // autoplay={{ delay: autoPlayDelay ? autoPlayDelay * 1000 : 5000, pauseOnMouseEnter: true, disableOnInteraction: false }}
                            // pagination={{ enabled: false }}
                            // modules={[Pagination, Navigation, FreeMode, Autoplay]}
                            // navigation={{ enabled: false }}
                            // breakpoints={{
                            //     430: {
                            //         modules: [Pagination, Navigation, FreeMode, Autoplay],
                            //         pagination: { enabled: true, dynamicBullets: true, dynamicMainBullets: 3, clickable: true },
                            //         slidesPerView: 6,
                            //         loop: true,
                            //         freeMode: false,
                            //         slidesPerGroup: 6,
                            //         loopFillGroupWithBlank: true,
                            //         // loopPreventsSlide: true,
                            //         // navigation: { enabled: true, nextEl: '.navigationButtonGreeting.next', prevEl: '.navigationButtonGreeting.prev' },
                            //         navigation: { enabled: true },
                            //     }
                            // }}