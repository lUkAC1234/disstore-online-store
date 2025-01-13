import styles from './Home.module.scss';
import { PureComponent, ReactNode, lazy, Suspense } from "react";
import "swiper/css";
import { ClothesListActions } from 'components/Context/ClothesListContext';
import { ClothesListContext } from 'components/Context/ContextCollection';
import { withContext } from 'components/Context/ContextInjector';
import SpinnerLoaderWrapper from 'components/Loaders/SpinnerLoaderWrapper';

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

class MainPage extends PureComponent<ClothesListActions>  {
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
        
        <Suspense fallback={<SpinnerLoaderWrapper relativeCentered />}>
          <WelcomeSection />
        </Suspense>

        <Suspense fallback={<SpinnerLoaderWrapper relativeCentered />}>
          <BrandsSection />
        </Suspense>

        <Suspense fallback={<SpinnerLoaderWrapper relativeCentered />}>
          <NewClothes />
        </Suspense>

        <div className={styles["hr-line"]}></div>

        <Suspense fallback={<SpinnerLoaderWrapper relativeCentered />}>
          <TopSelling />
        </Suspense>

        <Suspense fallback={<SpinnerLoaderWrapper relativeCentered />}>
          <ExtraOffer />
        </Suspense>

        <Suspense fallback={<SpinnerLoaderWrapper relativeCentered />}>
          <BrowseSection />
        </Suspense>

        <Suspense fallback={<SpinnerLoaderWrapper relativeCentered />}>
          <FeedbackSection />
        </Suspense>
      </>
    );
  }
}

const UIHome = withContext(ClothesListContext, MainPage);

export default UIHome;