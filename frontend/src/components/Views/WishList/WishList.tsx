import { ReactNode } from "react";
import styles from "./WishList.module.scss";
import { ProductModalContext, WishlistContext } from "components/Context/ContextCollection";
import { withContextSelector } from "components/Context/ContextInjector";
import WishlistEmpty from "./WishListEmpty/WishlistEmpty";
import { ModalHandler } from "components/Modal/Modal.utils";
import UICatalogModal from "../Catalog/CatalogDetails/CatalogModal/CatalogDetailsModal";
import CatalogItem from "../Catalog/CatalogList/CatalogProductsList/CatalogItem/CatalogItem";
import { HeadingOne } from "components/UI/Html/Elements/Elements";

class WishList extends ModalHandler<WishListProps, WishListState> {
  state: Readonly<{ pathname: string; }> = {
    pathname: location.pathname,
  };
  
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
              <HeadingOne className={styles["wishlist-title"]}>Мои желания</HeadingOne>
              <div className={styles["wishlist-items-wrapper"]}>
                {wishlistItems.map((wishlistItem) => (
                  <CatalogItem
                    key={wishlistItem.id}
                    item={wishlistItem.product}
                    isInWishlist={true}
                    onWishlistClick={() => removeFromWishlist(wishlistItem.id)}
                    onCartClick={() =>
                      this.openModal(
                        <UICatalogModal productSlug={wishlistItem.product.slug} />
                      )
                    }
                  />
                ))}
              </div>
            </>
          ) : (
            <WishlistEmpty />
          )}
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

export default UIWishList;
