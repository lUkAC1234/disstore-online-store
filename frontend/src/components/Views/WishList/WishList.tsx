import { ReactNode } from "react";
import styles from "./WishList.module.scss";
import { WishlistItem } from "components/Context/WishlistContext";
import { ProductModalContext, WishlistContext } from "components/Context/ContextCollection";
import { withContextSelector } from "components/Context/ContextInjector";
import WishlistEmpty from "./WishListEmpty/WishlistEmpty";
import { ModalHandler } from "components/Modal/Modal.utils";
import { getWithTranslation } from "i18n/hooks";
import { WithTranslation } from "react-i18next";
import UICatalogModal from "../Catalog/CatalogDetails/CatalogModal/CatalogDetailsModal";
import CatalogItem from "../Catalog/CatalogList/CatalogProductsList/CatalogItem/CatalogItem";

interface WishListProps extends WithTranslation {
  toggleModal: (callback: () => void) => void;
  setModalChildren: (children: ReactNode) => void;
  isModalActive: boolean;
  modalChildren: ReactNode;

  wishlistItems: WishlistItem[];
  removeFromWishlist: (wishlistItemId: number) => Promise<void>;
}

class WishList extends ModalHandler<WishListProps, { pathname: string }> {
  state: Readonly<{ pathname: string; }> = {
    pathname: location.pathname,
  };

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
                {wishlistItems.map((wishlistItem) => (
                  <CatalogItem
                    key={wishlistItem.id}
                    item={wishlistItem.product}
                    lang={this.lang}
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

export default getWithTranslation(UIWishList);
