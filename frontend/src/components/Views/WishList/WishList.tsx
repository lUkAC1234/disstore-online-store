import { ReactNode } from "react";
import styles from "./WishList.module.scss";
import { Link } from "react-router-dom";
import { WishlistItem } from "components/Context/WishlistContext";
import { ProductModalContext, WishlistContext } from "components/Context/ContextCollection";
import { withContextSelector } from "components/Context/ContextInjector";
import WishlistEmpty from "./WishListEmpty/WishlistEmpty";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import { ModalHandler } from "components/Modal/Modal.utils";
import { getWithTranslation } from "i18n/hooks";
import { WithTranslation } from "react-i18next";
import UICatalogModal from "../Catalog/CatalogDetails/CatalogModal/CatalogDetailsModal";

interface WishListProps extends WithTranslation {
  toggleModal: (callback: () => void) => void;
  setModalChildren: (children: ReactNode) => void;
  isModalActive: boolean;
  modalChildren: ReactNode;

  wishlistItems: WishlistItem[];
  removeFromWishlist: (wishlistItemId: number) => Promise<void>;
}

class WishList extends ModalHandler<WishListProps, WishListState> {
  get lang(): string {
    return this.props.i18n.language
  }
  componentDidMount(): void {
    if (document.documentElement.scrollTop > 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }
  render(): ReactNode {
    const { wishlistItems, removeFromWishlist } = this.props;
    return (
      <section className={styles["wishlist-section"]}>
        {this.renderModal()}
        <div className={styles["wishlist-container"]}>
          {wishlistItems.length > 0 ? (
            <>
              <h1 className={styles["wishlist-title"]}>Мои желания</h1>

              <div className={styles["wishlist-items-wrapper"]}>
                {wishlistItems.map(item => {
                  const firstImage = item.product.catalogImages?.[0];
                  const imageSrc = firstImage?.image || firstImage?.thumbnail;
                  if (!item.product) return <h1>No item</h1>;
                  return (
                    <div key={item.id} className={styles["wishlist-item"]}>
                      <Link
                        to={`/${this.lang}/catalog/clothes/${item.product.slug}`}
                        className={styles["wishlist-item-link"]}
                      />
                      <button
                        className={styles["wishlist-item-remove"]}
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <svg
                          width="1.25rem"
                          height="1.25rem"
                          viewBox="0 0 24 24"
                          fill="#141415"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M2 9.5C2 6.49094 4.43065 4 7.5 4C9.73143 4 11.2249 5.30207 12 6.21581C12.7751 5.30207 14.2686 4 16.5 4C19.5702 4 22 6.49102 22 9.5C22 10.8218 21.4706 12.1189 20.7206 13.3098C19.9669 14.5066 18.954 15.6539 17.9013 16.6906C16.4429 18.1269 14.808 19.4384 13.6502 20.3672C13.1649 20.7565 12.7634 21.0786 12.4939 21.3144C12.2111 21.5619 11.7889 21.5619 11.5061 21.3144C11.2366 21.0786 10.8351 20.7565 10.3498 20.3672C9.19201 19.4384 7.55712 18.1269 6.09873 16.6906C5.04602 15.6539 4.03308 14.5066 3.27942 13.3098C2.52941 12.1189 2 10.8218 2 9.5Z" fill="var(--clothes-discount-number)" />
                        </svg>
                      </button>
                      <div className={styles["wishlist-image-container"]}>
                        {item.product.discount > 0 && (
                          <span className={styles["wishlist-discount"]}>
                            -{item.product.discount}%
                          </span>
                        )}
                        {imageSrc ? (
                          <img src={imageSrc} alt={item.product.title} />
                        ) : (
                          <SpinnerLoaderWrapper />
                        )};

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
                              {item.product.real_price?.toLocaleString("en-US")} сум
                            </span>
                            {item.product.discount > 0 && (
                              <span className={styles["wishlist-price"]}>
                                {item.product.price?.toLocaleString("en-US")} сум
                              </span>
                            )}
                          </bdi>
                          <button
                            
                            className={styles["wishlist-add-cart-link"]}
                            onClick={() =>
                              this.openModal(
                                <UICatalogModal productSlug={item.product.slug} />,
                              )
                            }
                          >
                            <svg width="1.75rem" height="1.75rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 10V8H6V12.5C6 12.7761 5.77614 13 5.5 13C5.22386 13 5 12.7761 5 12.5V7H8C8 4.59628 9.95227 3 12 3C14.0575 3 16 4.70556 16 7H19V19.5C19 20.3284 18.3284 21 17.5 21H12.5C12.2239 21 12 20.7761 12 20.5C12 20.2239 12.2239 20 12.5 20H17.5C17.7761 20 18 19.7761 18 19.5V8H16V10H15V8H9V10H8ZM12 4C10.4477 4 9 5.20372 9 7H15C15 5.29444 13.5425 4 12 4Z" fill="black"></path>
                              <path d="M7.5 14C7.77614 14 8 14.2239 8 14.5V17H10.5C10.7761 17 11 17.2239 11 17.5C11 17.7761 10.7761 18 10.5 18H8V20.5C8 20.7761 7.77614 21 7.5 21C7.22386 21 7 20.7761 7 20.5V18H4.5C4.22386 18 4 17.7761 4 17.5C4 17.2239 4.22386 17 4.5 17H7V14.5C7 14.2239 7.22386 14 7.5 14Z" fill="black"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <WishlistEmpty />
          )
          }
        </div>
      </section>
    );
  }
}

const _UIWishList = withContextSelector(ProductModalContext, WishList, (context) => ({
  toggleModal: context.toggleModal,
  setModalChildren: context.setModalChildren,
  isModalActive: context.isModalActive,
  modalChildren: context.modalChildren
}));

const UIWishList = withContextSelector(WishlistContext, _UIWishList, (context) => ({
  wishlistItems: context.wishlistItems,
  removeFromWishlist: context.removeFromWishlist,
}));

export default getWithTranslation(UIWishList);