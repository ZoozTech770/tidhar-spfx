import * as React from 'react';
import { useEffect, useState } from 'react';
import { IArticleSliderProps } from './IArticleSliderProps';
import ArticleSliderUI from '../../../components/ArticleSlider/ArticleSliderUI';
import ArticlesHomeUI from '../../../components/ArticlesHome/ArticlesHomeUI';
import './ArticleSlider.scss';
import ArticlesHomeMobile from '../../../components/ArticlesHome/ArticlesHomeMobile';
import { ArticlesService } from '../../../services/ArticlesService';
import { ArticlesListItemType } from '../../../interfaces/Types';
import '../../../extensions/headerExt/overrideFonts.css';

const ArticleSlider = ({ articlePage, sliderListUrl, context, numOfItemsToDisplay, autoPlayDelay, title, articlesListUrl, allArticlesOpenInNewTab, allArticlesTitle, allArticlesUrl, numOfItemsToDisplayMobile }: IArticleSliderProps) => {

  const [articlesList, setArticlesList] = useState<ArticlesListItemType[]>([])

  useEffect(() => {
    ArticlesService.getData(context, articlesListUrl, articlePage, numOfItemsToDisplayMobile).then(data => {
      setArticlesList(data);
    })
  }, []);


  return (
    <div className='articles-comp-wrapper' id={'articles'}>
      <div className='articles-comp-container'>
        <h2 className='title'>{title}</h2>
        <ArticlesHomeUI title={title} articlesList={articlesList.slice(0, 3)} allArticlesOpenInNewTab={allArticlesOpenInNewTab} allArticlesTitle={allArticlesTitle} allArticlesUrl={allArticlesUrl} />
        <ArticleSliderUI listUrl={sliderListUrl} autoPlayDelay={autoPlayDelay} context={context} articlePage={articlePage} numOfItemsToDisplay={numOfItemsToDisplay} />
        <ArticlesHomeMobile articlesList={articlesList} allArticlesOpenInNewTab={allArticlesOpenInNewTab} allArticlesTitle={allArticlesTitle} allArticlesUrl={allArticlesUrl} />
      </div>
    </div>
  );
}
export default ArticleSlider;
