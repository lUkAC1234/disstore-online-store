import styles from './Home.module.scss';
import { PureComponent, ReactNode, lazy } from "react";
import "swiper/css";
import { UserContext, WishlistContext } from 'components/Context/ContextCollection';
import { withContextSelector } from 'components/Context/ContextInjector';
import { WishlistItem } from 'components/Context/WishlistContext';

const BannersSection = lazy(() => import("./Banners/Banners"));
const BrandsSection = lazy(() => import("./Brands/BrandsSection"));
const NewClothes = lazy(() => import("./New/NewClothesSection"));
const TopSelling = lazy(() => import("./Popular/TopSellingSection"));
const ExtraOffer = lazy(() => import("./ExtraOffer/ExtraOffer"));
const BrowseSection = lazy(() => import("./Browse/BrowseSection"));
const FeedbackSection = lazy(() => import("./Feedbacks/FeedbackSection"));
const WelcomeSection = lazy(() => import("./Welcome/WelcomeSection"));
const Faq = lazy(() => import("components/UI/Faq/Faq"));

export interface HomeProps {
  wishlistItems?: WishlistItem[];
  addToWishList?: (productId: number) => Promise<void>;
  removeFromWishlist?: (wishlistItemId: number) => Promise<void>;
  loadingWishlist?: boolean;
  isAuthenticated: boolean;
}

class MainPage extends PureComponent<HomeProps> {
  componentDidMount(): void { window.scrollTo({ top: 0, behavior: "smooth" }); }

  render(): ReactNode {
    return (
      <>
        <WelcomeSection />
        <BrandsSection />
        <BannersSection />
        <NewClothes
          wishlistItems={this.props.wishlistItems}
          addToWishList={this.props.addToWishList}
          removeFromWishlist={this.props.removeFromWishlist}
          loadingWishlist={this.props.loadingWishlist}
          isAuthenticated={this.props.isAuthenticated}
        />
        <div className={styles["hr-line"]}></div>
        <TopSelling
          wishlistItems={this.props.wishlistItems}
          addToWishList={this.props.addToWishList}
          removeFromWishlist={this.props.removeFromWishlist}
          loadingWishlist={this.props.loadingWishlist}
          isAuthenticated={this.props.isAuthenticated}
        />
        <ExtraOffer />
        <BrowseSection />
        <FeedbackSection />
        <Faq />
      </>
    );
  }
}


const _UIHome = withContextSelector(
  UserContext,
  MainPage,
  (context) => ({
    isAuthenticated: context.isAuthenticated,
  })
);

const UIHome = withContextSelector(
  WishlistContext,
  _UIHome,
  (context) => ({
    wishlistItems: context.wishlistItems,
    loadingWishlist: context.loadingWishlist,
    addToWishList: context.addToWishlist,
    removeFromWishlist: context.removeFromWishlist,
  })
);
export default UIHome;
