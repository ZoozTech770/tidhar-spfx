import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import './YearsSlider.scss';
import { Navigation } from 'swiper';

type YearsSliderProps = {
    years: number[];
    onYearChange: Function;
}

const ChevronRight = require('../../../assets/icons/arrowRight.svg');
const ChevronLeft = require('../../../assets/icons/arrowLeft.svg');

const YearsSlider = ({ years, onYearChange }: YearsSliderProps) => {

    const handleSlideChange = (event) => {
        onYearChange(years[event.activeIndex]);
    }

    return (
        <div className="years-swiper-container">
            <button id="nextYearButton" className='sliderNavigationButton prev'><img src={ChevronRight} alt="הבא" /></button>
            <Swiper onSlideChange={handleSlideChange} modules={[Navigation]} dir={'ltr'}
                    navigation={{ enabled: true, nextEl: '#nextYearButton', prevEl: '#prevYearButton' }}>
                {years.map(year => (
                    <SwiperSlide key={year}>
                        <div className="year-slider">{year}</div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <button id="prevYearButton" className='sliderNavigationButton next'><img src={ChevronLeft} alt="הקודם" /></button>
        </div >
    )
}
export default YearsSlider