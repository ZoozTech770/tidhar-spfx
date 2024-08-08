import * as React from 'react';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { ArticlesListItemType } from '../../interfaces/Types';
import '../../fonts/font.scss'
import styles from './ArticleSliderUI.module.scss'
import 'swiper/swiper-bundle.css';
import './ArticalSliderUI.scss';
import { Navigation, Autoplay, EffectFade, Pagination } from 'swiper';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ArticlesService } from '../../services/ArticlesService';
import useDateFormatter from '../../util/useDateFormatter';

type ArticleSliderUIProps = {
  listUrl: string;
  autoPlayDelay: number;
  articlePage:string;
  context: WebPartContext;
  numOfItemsToDisplay: number;
}

const ArrowRight = require('../../assets/ArrowRight.svg');
const ArrowLeft = require('../../assets/ArrowLeft.svg');

const ArticleSliderUI = ({ listUrl, autoPlayDelay, context,articlePage, numOfItemsToDisplay }: ArticleSliderUIProps) => {

  const [list, setList] = useState<ArticlesListItemType[]>([]);

  useEffect(() => {
    ArticlesService.getSliderData(context, listUrl,articlePage, numOfItemsToDisplay).then(data => {
      setList(data)
    });
  }, [])

  const { formatDate } = useDateFormatter();

  if (list.length > 0) {

    return (
      <div className={styles.sliderContainer + ' articleSlider'}>
        {list.length > 1 && <button id="prevArticleButton" className='navigationButton prev'><img src={ArrowRight} alt="הקודם" /></button>}
        <Swiper
          className='main-slider'
          loop={true}
          dir='rtl'
          modules={[Navigation, Autoplay, EffectFade, Pagination]}
          pagination={{ enabled: true, dynamicBullets: true, dynamicMainBullets: 3, clickable: true }}
          effect='fade'
          autoplay={{ delay: autoPlayDelay ? autoPlayDelay * 1000 : 5000, pauseOnMouseEnter: true, disableOnInteraction: false }}
          breakpoints={{
            431: {
              navigation: { enabled: true, nextEl: '#nextArticleButton.navigationButton', prevEl: '#prevArticleButton.navigationButton' },
              pagination: { enabled: true, dynamicBullets: true, dynamicMainBullets: 3, clickable: true }
            }
          }}
        >
          {list.map((article, i) => (
            <SwiperSlide key={i}>
              <a className={styles.articleContainer} href={article.URL.Url} target={article.URL.OpenURLInNewTab ? '_blank' : '_self'} data-interception="off">
                <img className={styles.articleImg} src={article.Picture.UrlLaptop} />
                <div className={styles.articleDetails}>
                  <div className={styles.articleTitleContainer}>
                    <div className={styles.articleCategory}>{article.Category}</div>
                    <div className={styles.articleTitle} title={article.Title}>{article.Title}</div>
                  </div>
                  <div className={styles.articleSubDetails}>
                    {article.From && <div className={styles.articleSubDetail}>{article.From}</div>}
                    {article.PublishDate && <div className={styles.articleSubDetail}>{formatDate(article.PublishDate)}</div>}
                    {article.Unit && <div className={styles.articleSubDetail}>{article.Unit}</div>}
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
        {list.length > 1 && <button id="nextArticleButton" className='navigationButton next'><img src={ArrowLeft} alt="הבא" /></button>}
      </div>
    )
  }
  return null;
}
export default ArticleSliderUI