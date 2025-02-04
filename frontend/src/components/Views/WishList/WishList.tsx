import { ReactNode } from "react";
import styles from "./WishList.module.scss";
import { Link } from "react-router-dom";
import i18next from "i18next";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { WishlistContextActions } from "components/Context/WishlistContext";
import UIReact from "utils/classes/UIReact";
import { WishlistContext } from "components/Context/ContextCollection";
import { withContext } from "components/Context/ContextInjector";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";
const lang: string = i18next.language;

interface WishListProps extends WishlistContextActions { }

class WishList extends UIReact<WishListProps, WishListState> {
  async componentDidMount(): Promise<void> {
    if (document.documentElement.scrollTop > 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }
  render(): ReactNode {
    const { wishlistItems, loading, removeFromWishlist } = this.props;

    if (loading) return <SpinnerLoaderWrapperFixed />;

    return (
      <section className={styles["wishlist-section"]}>
        <div className={styles["wishlist-container"]}>
          <h1 className={styles["wishlist-title"]}>Мои желания</h1>

          <div className={styles["wishlist-items-wrapper"]}>
            {wishlistItems.map(item => (
              <div key={item.id} className={styles["wishlist-item"]}>
                <Link
                  to={`/${lang}/catalog/${item.product.id}`}
                  className={styles["wishlist-item-link"]}
                />
                <button
                  className={styles["wishlist-item-remove"]}
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <div className={styles["wishlist-image-container"]}>
                  {item.product.discount > 0 && (
                    <span className={styles["wishlist-discount"]}>
                      -{item.product.discount}%
                    </span>
                  )}
                  <SpinnerLoaderWrapper />
                  <img
                    src={item.product.catalogImages[0]?.thumbnail}
                    alt={item.product.title}
                  />
                </div>
                <div className={styles["wishlist-item-info-container"]}>
                  <h2 className={styles["wishlist-item-title"]}>
                    {item.product.title}
                  </h2>
                  <p className={styles["wishlist-item-description"]}>
                    {item.product.short_description?.slice(0, 40)}
                  </p>
                  <p className={styles["wishlist-item-count"]}>
                    {item.product.count > 0 ? (
                      `В наличии (${item.product.count} шт)`
                    ) : 'Товар закончился'}
                  </p>

                  <div className={styles["wishlist-price-container"]}>
                    <bdi className={styles["wishlist-price-wrapper"]}>
                      <span className={styles["wishlist-real-price"]}>
                        {item.product.real_price.toLocaleString("en-US")} сум
                      </span>
                      {item.product.discount > 0 && (
                        <span className={styles["wishlist-price"]}>
                          {item.product.price.toLocaleString("en-US")} сум
                        </span>
                      )}
                    </bdi>
                    <Link
                      to={`/${lang}/cart`}
                      className={styles["wishlist-add-cart-link"]}
                    >
                      <svg width="1.75rem" height="1.75rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 10V8H6V12.5C6 12.7761 5.77614 13 5.5 13C5.22386 13 5 12.7761 5 12.5V7H8C8 4.59628 9.95227 3 12 3C14.0575 3 16 4.70556 16 7H19V19.5C19 20.3284 18.3284 21 17.5 21H12.5C12.2239 21 12 20.7761 12 20.5C12 20.2239 12.2239 20 12.5 20H17.5C17.7761 20 18 19.7761 18 19.5V8H16V10H15V8H9V10H8ZM12 4C10.4477 4 9 5.20372 9 7H15C15 5.29444 13.5425 4 12 4Z" fill="black"></path>
                        <path d="M7.5 14C7.77614 14 8 14.2239 8 14.5V17H10.5C10.7761 17 11 17.2239 11 17.5C11 17.7761 10.7761 18 10.5 18H8V20.5C8 20.7761 7.77614 21 7.5 21C7.22386 21 7 20.7761 7 20.5V18H4.5C4.22386 18 4 17.7761 4 17.5C4 17.2239 4.22386 17 4.5 17H7V14.5C7 14.2239 7.22386 14 7.5 14Z" fill="black"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
}

const UIWishList = withContext(WishlistContext, WishList);

export default UIWishList;