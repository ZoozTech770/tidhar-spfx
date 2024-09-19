import * as React from 'react';
import './ArticlesHomeUI.module.scss';
import { ArticlesListItemType } from '../../interfaces/Types';
import useDateFormatter from '../../util/useDateFormatter';

type ArticlesHomeProps = {
  title: string;
  titleIcon?: string;
  articlesList: ArticlesListItemType[];
  allArticlesTitle?: string;
  allArticlesUrl: string;
  allArticlesOpenInNewTab?: boolean;
}

const ArrowLeft = require('../../assets/ArrowRight.svg');

const ArticlesHomeUI = ({ title, articlesList: list, allArticlesOpenInNewTab, allArticlesTitle, allArticlesUrl }: ArticlesHomeProps) => {

  const { formatDate } = useDateFormatter();

  if (list.length > 0) {

    return (
      <div className='articles-home-container'>
        <h2 className='articles-home-title'>
          {title}
        </h2>
        <ul className="articles-list">
          {list.map(article => (
            <li className='articles-list-item'>
              <a href={article.URL.Url} target={article.URL.OpenURLInNewTab ? '_blank' : '_self'} data-interception="off" className='article-container'>
                <div className='article-img-container'>
                  <img className='article-img' src={article.Picture.UrlLaptop} />
                </div>
                <div className="article-details">
                  <div className='article-category'>{article.Category}</div>
                  <h3 className='article-title' title={article.Title}>{article.Title}</h3>
                  <div className='article-subdetails'>
                    {article.From && <div className="article-subdetail">{article.From}</div>}
                    {article.PublishDate && <div className="article-subdetail">{formatDate(article.PublishDate)}</div>}
                    {article.Unit && <div className="article-subdetail">{article.Unit}</div>}
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
        <a href={allArticlesUrl} target={allArticlesOpenInNewTab ? '_blank' : '_self'} data-interception="off" className='all-articles'>
          {allArticlesTitle} <img src={ArrowLeft} className='all-articles-icon'/>
        </a>
      </div>
    );
  }

  return <></>;

}
export default ArticlesHomeUI;