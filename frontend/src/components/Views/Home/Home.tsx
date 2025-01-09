import styles from './Home.module.scss';
import { PureComponent, ReactNode } from "react";
import "swiper/css";
import BrandsSection from "./BrandsSection";
import NewClothes from "./NewClothesSection";
import TopSelling from "./TopSellingSection";
import ExtraOffer from "./ExtraOffer";
import BrowseSection from "./BrowseSection";
import FeedbackSection from "./FeedbackSection";
import WelcomeSection from "./WelcomeSection";
// import Transition from "components/Animations/Transition/Transition";
// import DateComputed from "components/DateComputed/DateComputed";

class MainPage extends PureComponent {
  async componentDidMount(): Promise<void> {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  
  render(): ReactNode {
    
    return (
      <>
        {/* <DateComputed date={new Date("02-08-2008 4:30")} order={"year/day/month"} orderStyle="." includeTime={true} timeOrder="hours:minutes:seconds:milliseconds">
          
        </DateComputed> */}
        
        <WelcomeSection />

        <BrandsSection />

        <NewClothes />

        <div className={styles["hr-line"]}></div>

        <TopSelling />

        <ExtraOffer />

        <BrowseSection />

        <FeedbackSection />
      </>
    );
  }
}

export default MainPage;
