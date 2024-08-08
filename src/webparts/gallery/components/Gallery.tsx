import * as React from 'react';
import { useState, useEffect } from 'react';
import { IGalleryProps } from './IGalleryProps';
import { GalleryService } from '../../../services/GalleryService';
import GalleryWP from '../../../components/Gallery/GalleryWP';
import { IGalleriesByYears } from '../../../interfaces/IGallery';

const Gallery: React.FC<IGalleryProps> = ({context, pictureLibrary, ...props}) => {

  const [galleriesByYears, setGalleriesByYears] = useState<IGalleriesByYears[]>([]);

  useEffect(() => {
    GalleryService.getGallery(context, pictureLibrary).then(response => {
      setGalleriesByYears(response);
    });
  }, []);


  const handleYearChange = () => {

  }
  return (
    <GalleryWP galleries={galleriesByYears} onYearChange={handleYearChange} {...props}/>
  );
}
export default Gallery;
