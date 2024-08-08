import { IAnchor } from '../../interfaces/AnchorsNav.interface';
import useWindowSizeListener from '../../util/useWindowSizeListener';
import classes from './AnchorsNavUI.module.scss';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

type AnchorsNavUIProps = {
}

const AnchorsNavUI = () => {

  const [scrollTop, setScrollTop] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { isDesktopView } = useWindowSizeListener();
  const isInViewport = (element, i) => {

    const scrollableElement = document.querySelector('[data-automation-id="contentScrollRegion"]')
    if (scrollableElement.scrollTop <= 64) {
      if (i === 0) {
        return true
      }
      else {
        return false;
      }
    }

    if (scrollableElement.scrollTop + 751 >= scrollableElement.scrollHeight) {
      if (i === ANCHORS.length - 1) {
        return true
      }
      else {
        return false;
      }
    }
    return element?.offsetTop <= scrollTop && element?.offsetTop + element.clientHeight - 1 >= scrollTop;
  };

  useEffect(() => {
    const element = document.querySelector('[data-automation-id="contentScrollRegion"]') as HTMLElement;
    element.style.scrollBehavior = 'smooth';
    const eventHandler = () => {
      setScrollTop(element.scrollTop);
    }
    element.addEventListener('scroll', eventHandler);

      setTimeout(() => {
        if (window.innerWidth < 430) {
        document.querySelector('[data-automation-id="contentScrollRegion"]').scrollTo({ top: 50, behavior: 'auto' });
        }
        setIsLoading(false);
      }, 1500)

    return () => {
      element.removeEventListener('scroll', eventHandler);
    }
  }, []);


  if (isLoading) {
    return null;
  }

  return (
    <div className={classes.anchorsNavContainer}>
      {ANCHORS.map((anchor, i) => {
        const active = isInViewport(document.getElementById(anchor.id), i);
        if (document.getElementById(anchor.id)) {
          return <a id={'anchor_' + anchor.id} className={`${classes.anchor} ${active ? classes.visible : ''}`} key={anchor.id} href={"#" + anchor.id}>{anchor.title}</a>
        }
      })}
    </div>
  )
}
export default AnchorsNavUI

const ANCHORS: IAnchor[] = [
  {
    id: 'articles',
    title: 'ידיעות, מבזקים וחדשות'
  },
  {
    id: 'events',
    title: 'אירועים'
  },
  {
    id: 'our_projects',
    title: 'הפרוייקטים שלנו'
  },
  {
    id: 'my_inquiries',
    title: 'פניות פעילות שלי'
  },
  {
    id: 'jobs',
    title: 'קריירה בתדהר'
  },
  {
    id: 'bring_friends',
    title: 'חבר מביא חבר'
  },
  {
    id: 'thanks',
    title: 'מובילים בשירות'
  },
  {
    id: 'new_employees',
    title: 'הצטרפו אלינו החודש'
  },
  {
    id: 'greetings',
    title: 'ברכות ואיחולים'
  },
  {
    id: 'gallery',
    title: 'גלריה'
  }
]