import styles from './Home.module.scss';
import { PureComponent, ReactNode, lazy } from "react";
import "swiper/css";
import { ClothesListActions } from 'components/Context/ClothesListContext';
import { ClothesListContext } from 'components/Context/ContextCollection';
import { withContext } from 'components/Context/ContextInjector';

// Lazy load non-critical sections
const BrandsSection = lazy(() => import("./BrandsSection"));
const NewClothes = lazy(() => import("./NewClothesSection"));
const TopSelling = lazy(() => import("./TopSellingSection"));
const ExtraOffer = lazy(() => import("./ExtraOffer"));
const BrowseSection = lazy(() => import("./BrowseSection"));
const FeedbackSection = lazy(() => import("./FeedbackSection"));
const WelcomeSection = lazy(() => import("./WelcomeSection"));
// import Transition from "components/Animations/Transition/Transition";
// import DateComputed from "components/DateComputed/DateComputed";

class MainPage extends PureComponent<ClothesListActions> {
  async componentDidMount(): Promise<void> {
    if (document.documentElement.scrollTop > 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
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

const UIHome = withContext(ClothesListContext, MainPage);

export default UIHome;