import * as React from 'react';
import styles from './BackToHome.module.scss';

interface IBackToHomeProps{
   context:any
}
const BackToHome: React.FC<IBackToHomeProps> = (props) => {
  const {context} = props; 
  return (
   <div className={styles.backToHomeContainer}>
      <a className={styles.backToHomeButton} href={context.pageContext.site.absoluteUrl}></a>
   </div> 
  );
}
export default BackToHome;