import * as React from 'react';
import classes from './calenderOfEvents.module.scss';

type EventsTabsHeaderProps = {
  titleList: string;
  titleCalender: string;
  titleYear: number;
  tabIndex: number;
  onSelectTab: (tabId: number) => void;
};

const EventsTabsHeader: React.FC<EventsTabsHeaderProps> = (props) => {
  const { titleList, titleCalender, titleYear, tabIndex, onSelectTab } = props;

  return (
    <nav className={classes.tabsTitle} role="tablist">
      <button
        className={`${classes.title} ${tabIndex === 1 ? classes.tabActive : ""}`}
        role="tab"
        aria-selected={1 === tabIndex}
        tabIndex={1 !== tabIndex ? -1 : 0}
        onClick={() => onSelectTab(1)}
      >
        {titleList}
      </button>
      <button
        className={`${classes.title} ${tabIndex === 2 ? classes.tabActive : ""}`}
        role="tab"
        aria-selected={2 === tabIndex}
        tabIndex={2 !== tabIndex ? -1 : 0}
        onClick={() => onSelectTab(2)}
      >
        {titleCalender} {titleYear}
      </button>
    </nav>
  );
};

export default EventsTabsHeader;
