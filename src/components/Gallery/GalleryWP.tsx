import * as React from 'react';
import { useState, useEffect } from 'react'
import { IGalleriesByYears } from '../../interfaces/IGallery';
import Range from './Range/Range';
import './GalleryWP.scss';
import GallerySlider from './GallerySlider/GallerySlider';
import useDateFormatter from '../../util/useDateFormatter';
import YearsSlider from './YearsSlider/YearsSlider';

type GalleryWPProps = {
  galleries: IGalleriesByYears[];
  title: string;
  toAllLinkTitle: string;
  toAllLinkUrl: string;
  toAllLinkNewTab: boolean;
  onYearChange: Function;
}

const GalleryWP = ({ galleries, title }: GalleryWPProps) => {

  const handleRangeChange = (value) => {
    setSliderIndex(value);
  }

  const handleSliderChange = (value) => {
    setRangeIndex(value);
    setSliderIndex(value);
  }


  const colors = ['#E53D51', '#FFB548', '#8AB7E9', '#004438', "#FE9015", "#4A9462", "#F8A3B4", '#E53D51', '#FFB548', '#8AB7E9', '#004438', "#FE9015"]

  const [sliderIndex, setSliderIndex] = useState(0);
  const [rangeIndex, setRangeIndex] = useState(0);
  const [labels, setLabels] = useState<string[]>([]);
  const [currentGallery, setCurrentGallery] = useState<IGalleriesByYears>({} as IGalleriesByYears);
  const [years, setYears] = useState<number[]>([]);
  const { getHebrewMonth } = useDateFormatter();

  useEffect(() => {
    if (currentGallery && currentGallery.months) {
      setLabels(currentGallery.months.map(galleryItem => getHebrewMonth(galleryItem.month)))
      const numberOfEventsInGallery = currentGallery.months.filter(month => month.events.length > 0).map(month => month.events.length).reduce((a, b) => a + b);
      setSliderIndex(numberOfEventsInGallery - 1); // In order to show the last slider first
    }
  }, [currentGallery])

  useEffect(() => {
    setCurrentGallery(galleries[0]);
    setYears(galleries.map(gallery => gallery.year));
  }, [galleries])

  const handleYearChange = (year: number) => {
    setCurrentGallery(galleries.find(gallery => gallery.year === year))
  }

  return (
    <div className='galleries-webpart-wrapper' id={"gallery"}>
      <h2 className='galleries-title'>{title}</h2>
      <div className='galleries-container'>
        <GallerySlider sliderIndex={sliderIndex} galleries={currentGallery?.months} onSliderChange={handleSliderChange} />
        <Range gallery={currentGallery?.months} labels={labels} onRangeChange={handleRangeChange} colors={colors} rangeIndex={rangeIndex} />
        <YearsSlider years={years} onYearChange={handleYearChange} />
      </div>
    </div>
  );
}

export default GalleryWP