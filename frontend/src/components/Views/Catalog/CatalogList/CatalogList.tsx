import styles from "./CatalogList.module.scss";
import { createRef, ReactNode } from "react";
import { Link } from "react-router-dom";
import i18next from "i18next";
import UIReact from "utils/classes/UIReact";
import { withContextSelector } from "components/Context/ContextInjector";
import { ClothesListContext, WishlistContext } from "components/Context/ContextCollection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faSliders } from "@fortawesome/free-solid-svg-icons";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";
import CatalogErrorPage from "./CatalogError/CatalogErrorPage.tsx";
import CatalogPagination from "./CatalogPagination/CatalogPagination.tsx";
import CatalogProducts from "./CatalogProductsList/Products.tsx";
import Filters from "./CatalogFilters/Filters.tsx";
import { ClothItem } from "components/Context/ClothesContext.tsx";
import { WishlistItem } from "components/Context/WishlistContext.tsx";

const lang: string = i18next.language;

interface CatalogState {
  isFilterActive: boolean;
}

interface CatalogListProps {
  loading: boolean; 
  error: boolean;
  products: ClothItem[];
  currentPage: number;
  totalPages: number;
  loadingProducts: boolean;
  resetFilters: () => void;
  setNextPage: () => void;
  setPrevPage: () => void;

  // Wishlist
  wishlistItems: WishlistItem[];
  loadingWishlist: boolean;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (wishlistItemId: number) => Promise<void>;
}

class CatalogList extends UIReact<CatalogListProps, CatalogState> {
  catalogFiltersContainerRef = createRef<HTMLDivElement>();
  state: CatalogState = {
    isFilterActive: false,
  };

  async componentDidMount(): Promise<void> {
    if (document.documentElement.scrollTop > 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    document.addEventListener("mousedown", this.filtersHandleClickOutside, {
      signal: this.controller.signal,
    });
  }

  filtersHandleClickOutside = (event: MouseEvent) => {
    if (this.catalogFiltersContainerRef.current
      && !this.catalogFiltersContainerRef.current.contains(event.target as Node)) {
      this.setState({ isFilterActive: false });
    }
  };

  toggleFilter = () => {
    this.setState((prevState) => ({ isFilterActive: !prevState.isFilterActive }));
  };

  render(): ReactNode {
    const { 
      wishlistItems, 
      loadingWishlist, 
      loading, 
      error, 
      products, 
      currentPage, 
      totalPages, 
      addToWishlist, 
      removeFromWishlist,
      loadingProducts,
      resetFilters,
      setPrevPage,
      setNextPage
    } = this.props;

    if (loading) return <SpinnerLoaderWrapperFixed />;

    if (error) {
      return (
        <CatalogErrorPage error={"К сожалению, не удалось загрузить данные"} />
      );
    }

    return (
      <section className={styles["catalog-section"]}>
        <div className={styles["catalog-container"]}>
          <div className="catalog-link-way">
            <Link to={`/${lang}/`}>Главная</Link>
            <FontAwesomeIcon icon={faAngleRight} />
            Каталог
          </div>

          <div className={styles["catalog-wrapper"]}>
            <Filters
              isFilterActive={this.state.isFilterActive}
              toggleFilter={this.toggleFilter}
              catalogFiltersContainerRef={this.catalogFiltersContainerRef}
            />
            <div className={styles["catalog-items-list"]}>
              <div className={styles["catalog-head-subtitle-container"]}>

                <div className={styles["catalog-active-filter"]}>
                  <button
                    className={styles["filters-mobile-version"]}
                    onClick={this.toggleFilter}
                    style={{ pointerEvents: this.state.isFilterActive ? 'none' : 'auto' }}
                  >
                    <FontAwesomeIcon icon={faSliders} />
                  </button>
                  <h1 className={styles["catalog-active-filter-title"]}>Каталог</h1>
                </div>
              </div>
              {loadingProducts ? (
                <SpinnerLoaderWrapper relativeCentered />
              ) : products && products.length > 0 ? (
                <CatalogProducts 
                wishlistItems={wishlistItems}
                loadingWishlist={loadingWishlist} 
                products={products} 
                addToWishList={addToWishlist} 
                removeFromWishlist={removeFromWishlist} 
                />
              ) : (
                <CatalogErrorPage
                  resetFilters={resetFilters}
                  error={"К сожалению, данные отсутствуют"}
                />
              )}
              {totalPages > 1 ? (
                <>
                  <div className={styles["hr-line"]}></div>
                  <CatalogPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePrevPage={setPrevPage}
                    handleNextPage={setNextPage}
                  />
                </>
              ) : (
                null
              )}
            </div>
          </div>
        </div>
      </section >
    );
  }
}

const _UICatalogList = withContextSelector(ClothesListContext, CatalogList, (context) => ({
  loading: context.loading, 
  error: context.error,
  products: context.products,
  currentPage: context.currentPage,
  totalPages: context.totalPages,
  loadingProducts: context.loadingProducts,
  resetFilters: context.resetFilters,
  setNextPage: context.setNextPage,
  setPrevPage: context.setPrevPage,
}));

const UICatalogList = withContextSelector(WishlistContext, _UICatalogList, (context) => ({
  wishlistItems: context.wishlistItems, 
  loadingWishlist: context.loadingWishlist, 
  addToWishlist: context.addToWishlist, 
  removeFromWishlist: context.removeFromWishlist,
}));
  
export default UICatalogList;
