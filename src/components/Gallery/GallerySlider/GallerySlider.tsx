import * as React from 'react';
import { useEffect, useState, useRef } from 'react'
import { IGalleries, IGallery } from '../../../interfaces/IGallery';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import useDateFormatter from '../../../util/useDateFormatter';

import 'swiper/swiper-bundle.css';
import './GallerySlider.scss';

type GllerySliderProps = {
    sliderIndex: number;
    galleries: IGalleries[];
    onSliderChange: Function
}

const ArrowRight = require('../../../assets/ArrowRight.svg');
const ArrowLeft = require('../../../assets/ArrowLeft.svg');


const GallerySlider = ({ sliderIndex, galleries, onSliderChange }: GllerySliderProps) => {

    const { getHebrewMonth } = useDateFormatter();

    const [flatGalleries, setFlatGalleries] = useState<IGallery[]>([]);

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.swiper.slideTo(sliderIndex, undefined, false);
        }
    }, [sliderIndex]);

    useEffect(() => {
        if (galleries)
            setFlatGalleries(galleries.flatMap(gallery => gallery.events));
    }, [galleries]);

    const swiperRef = useRef<SwiperRef>();

    const handleSlideChange = (event) => {
        onSliderChange(event.activeIndex);
    }

    if (flatGalleries.length > 0)

        return (
            <div className="slider-container">
                <button id="prevGalleryButton" className='navigationButton'><img src={ArrowRight} alt="הקודם" /></button>
                <Swiper ref={swiperRef} spaceBetween={20} onSlideChange={handleSlideChange} modules={[Navigation]} slidesPerView={'auto'} centeredSlides={true} dir='rtl'
                    breakpoints={{
                        431: { navigation: { enabled: true, nextEl: '#nextGalleryButton.navigationButton', prevEl: '#prevGalleryButton.navigationButton' }, slidesPerView: 1, centeredSlides: false }
                    }}>
                    {flatGalleries.map((gallery, i) => {
                        const galleryDate = new Date(gallery.date);
                        return <SwiperSlide key={i}>
                            <a className="album" href={gallery.albumUrl}>
                                <div className="album-images">
                                    <div className='small-rectangle'><img src={gallery.smallRectanglePicture} /></div>
                                    <div className='small-cube'><img src={gallery.smallCubePicture} /></div>
                                    <div className='big-rectangle'><img src={gallery.bigRectanglePicture} /></div>
                                    <div className='big-cube'><img src={gallery.bigCubePicture} /></div>
                                </div>
                                <div className="album-details" >
                                    <div className='album-title'>{gallery.title}</div>
                                    <div className='album-date'>{galleryDate.getDate()} {getHebrewMonth(galleryDate.getMonth())}, {galleryDate.getFullYear()}</div>
                                </div>
                            </a>
                        </SwiperSlide>
                    })}
                </Swiper>
                <button id="nextGalleryButton" className='navigationButton'><img src={ArrowLeft} alt="הבא" /></button>
            </div >
        )

    return null;
}
export default GallerySlider