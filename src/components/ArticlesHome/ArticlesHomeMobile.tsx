import * as React from "react"
import { FreeMode } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import { ArticlesListItemType } from "../../interfaces/Types";
import useDateFormatter from "../../util/useDateFormatter";

type ArticlesHomeMobileProps = {
    articlesList: ArticlesListItemType[];
    allArticlesTitle?: string;
    allArticlesUrl: string;
    allArticlesOpenInNewTab?: boolean;
}

const ArrowLeft = require('../../assets/ArrowRight.svg');

const ArticlesHomeMobile: React.FC<ArticlesHomeMobileProps> = ({ articlesList, allArticlesUrl, allArticlesOpenInNewTab, allArticlesTitle }: ArticlesHomeMobileProps) => {

    const { formatDate } = useDateFormatter()

    return (
        <div className="articles-mobile-container">
            <Swiper
                slidesPerView={'auto'}
                spaceBetween={30}
                freeMode={true}
                modules={[FreeMode]}
            >
                {articlesList.map((article, i) => (
                    <SwiperSlide key={i}>
                        <a className="article-mobile-container" href={article.URL.Url} target={article.URL.OpenURLInNewTab ? '_blank' : '_self'} data-interception="off">
                            <div className="article-mobile-img-container">
                                <img className="article-mobile-img" src={article.Picture.UrlMobile} alt={article.Picture.Alt} />
                            </div>
                            <div className="article-details">
                                <div className="article-category">{article.Category}</div>
                                <h3 className="article-title">{article.Title}</h3>
                                <div className="article-subdetails">
                                    {article.From && <div className="article-subdetail">{article.From}</div>}
                                    {article.Unit && <div className="article-subdetail">{article.Unit}</div>}
                                </div>
                                <div className="article-subdetails">
                                    {article.PublishDate && <div className="article-subdetail">{formatDate(article.PublishDate)}</div>}
                                </div>
                            </div>
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>
            <a href={allArticlesUrl} target={allArticlesOpenInNewTab ? '_blank' : '_self'} className='all-articles' data-interception="off">
                {allArticlesTitle} <img src={ArrowLeft} className='all-articles-icon' />
            </a>
        </div>
    )
}
export default ArticlesHomeMobile