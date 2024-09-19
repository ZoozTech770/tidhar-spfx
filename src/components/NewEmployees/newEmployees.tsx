import * as React from 'react';
import classes from './newEmployees.module.scss';
import './newEmployeesSwiper.module.scss';
import { INewEmployees } from "../../interfaces/INewEmployees";
import EmployeeItem from "./NewEmployeeItem/newEmployeeItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from 'swiper';
import 'swiper/swiper-bundle.css';

const ChevronRight = require('../../assets/icons/arrowRight.svg');
const ChevronLeft = require('../../assets/icons/arrowLeft.svg');

const NewEmployeesUI: React.FC<INewEmployees> = (props) => {
  const {
    Title,
    Users,
    ToAllUrl,
    autoPlayDelay,
    getGreetingCards,
    onSendGreeting
  } = props;

  const [usersChunks, setUsersChunks] = React.useState([]);

  React.useEffect(() => {
    setUsersChunks(sliceChunks(Users, 5));
  }, [Users])

  React.useEffect(() => {
  }, [usersChunks])


  const sliceChunks = (arr, chunkSize) => {
    const chunks = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      chunks.push(chunk);
    }

    return chunks
  }

  return (
    <div className={`${classes.newEmployeesContainer} newEmployeesContainer`}>
      <div className={classes.title}>{Title}</div>
      <div className={classes.wrapper}>
        {(Users && Users.length > 0) && <div className={classes.itemWrapper}>
          <Swiper spaceBetween={20} loop={usersChunks.length > 1} loopedSlides={2} autoplay={autoPlayDelay > 0 && { delay: autoPlayDelay * 1000 }}
            modules={[Autoplay, Navigation]}
            navigation={{ enabled: usersChunks.length > 1, nextEl: '#nextEmployees', prevEl: '#prevEmployees' }}>
            {
              usersChunks.map(usersChunk => {
                return <SwiperSlide>
                  {usersChunk.map(user =>
                    <EmployeeItem user={user} onSendGreeting={onSendGreeting} onGetGreetingCard={getGreetingCards} />
                  )}
                </SwiperSlide>
              })
            }
          </Swiper>
          {usersChunks.length > 1 && <div className={classes.slidersButtonsContainer}>
            <button id="prevEmployees" className='sliderNavigationButton prev'><img src={ChevronRight} alt="הבא" /></button>
            <button id="nextEmployees" className='sliderNavigationButton next'><img src={ChevronLeft} alt="הקודם" /></button>
          </div>}
        </div>}
        {ToAllUrl.Text && <div className={classes.link}> <a href={ToAllUrl.Url} target={ToAllUrl.OpenURLInNewTab ? "_blank" : "_self"} data-interception="off">{ToAllUrl.Text}</a></div>}
      </div>

    </div>
  );
}
export default NewEmployeesUI;