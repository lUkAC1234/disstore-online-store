import styles from './Home.module.scss';
import { PureComponent, ReactNode, lazy } from "react";
import "swiper/css";
import { UserContext, WishlistContext } from 'components/Context/ContextCollection';
import { withContextSelector } from 'components/Context/ContextInjector';
import { WithTranslation } from 'react-i18next';
import { getWithTranslation } from 'i18n/hooks';
import { WishlistItem } from 'components/Context/WishlistContext';

const BannersSection = lazy(() => import("./Banners"));
const BrandsSection = lazy(() => import("./BrandsSection"));
const NewClothes = lazy(() => import("./NewClothesSection"));
const TopSelling = lazy(() => import("./TopSellingSection"));
const ExtraOffer = lazy(() => import("./ExtraOffer"));
const BrowseSection = lazy(() => import("./BrowseSection"));
const FeedbackSection = lazy(() => import("./FeedbackSection"));
const WelcomeSection = lazy(() => import("./WelcomeSection"));
const Faq = lazy(() => import("components/UI/Faq/Faq"));

interface HomeProps extends WithTranslation {
  wishlistItems?: WishlistItem[];
  addToWishList?: (productId: number) => Promise<void>;
  removeFromWishlist?: (wishlistItemId: number) => Promise<void>;
  loadingWishlist?: boolean;
  isAuthenticated: boolean;
}

class MainPage extends PureComponent<HomeProps> {
  componentDidMount(): void { window.scrollTo({ top: 0, behavior: "smooth" }); }

  get lang(): string {
    return this.props.i18n.language
  }

  render(): ReactNode {
    return (
      <>
        <WelcomeSection lang={this.lang} />
        <BrandsSection />
        <BannersSection />
        <NewClothes
          wishlistItems={this.props.wishlistItems}
          addToWishList={this.props.addToWishList}
          removeFromWishlist={this.props.removeFromWishlist}
          loadingWishlist={this.props.loadingWishlist}
          isAuthenticated={this.props.isAuthenticated}
          lang={this.lang}
        />
        <div className={styles["hr-line"]}></div>
        <TopSelling
          wishlistItems={this.props.wishlistItems}
          addToWishList={this.props.addToWishList}
          removeFromWishlist={this.props.removeFromWishlist}
          loadingWishlist={this.props.loadingWishlist}
          isAuthenticated={this.props.isAuthenticated}
          lang={this.lang}
        />
        <ExtraOffer lang={this.lang} />
        <BrowseSection lang={this.lang} />
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

const TranslatedHome = getWithTranslation(UIHome);

export default TranslatedHome;
