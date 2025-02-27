import { ReactNode } from "react";
import { ClothItem } from "components/Context/ClothesContext";
import { WishlistItem } from "components/Context/WishlistContext";
import { withContextSelector } from "components/Context/ContextInjector";
import { ProductModalContext, UserContext, WishlistContext } from "components/Context/ContextCollection";
import { getWithTranslation } from "i18n/hooks";
import { WithTranslation } from "react-i18next";
import { ModalHandler } from "components/Modal/Modal.utils";
import UICatalogModal from "../../CatalogDetails/CatalogModal/CatalogDetailsModal";
import Authentication from "components/Views/Authentication/Authentication";
import CatalogItem from "./CatalogItem/CatalogItem";
import styles from "./Products.module.scss";

interface CatalogProductsProps extends WithTranslation {
  products: ClothItem[];
  wishlistItems?: WishlistItem[];
  addToWishList?: (productId: number) => Promise<void>;
  removeFromWishlist?: (wishlistItemId: number) => Promise<void>;
  loadingWishlist?: boolean;

  toggleModal: (callback: () => void) => void;
  setModalChildren: (children: ReactNode) => void;
  isModalActive: boolean;
  modalChildren: ReactNode;

  isAuthenticated: boolean;
}

class CatalogProducts extends ModalHandler<CatalogProductsProps> {
  get lang(): string {
    return this.props.i18n.language;
  }

  render(): ReactNode {
    const { products, isAuthenticated } = this.props;
    const wishlistProps = {
      wishlistItems: this.props.wishlistItems || [],
      loadingWishlist: this.props.loadingWishlist || false,
      addToWishList: this.props.addToWishList || (async () => {}),
      removeFromWishlist: this.props.removeFromWishlist || (async () => {}),
    };

    return (
      <div className={styles["catalog-items-wrapper"]}>
        {products.map((item: ClothItem) => {
          const wishlistItem = wishlistProps.wishlistItems.find(
            (wItem) => wItem.product.id === item.id
          );
          const inWishlist = Boolean(wishlistItem);

          return (
            <CatalogItem
              key={item.id}
              item={item}
              lang={this.lang}
              isInWishlist={inWishlist}
              onWishlistClick={(item: ClothItem) => {
                if (isAuthenticated) {
                  const existingWishlistItem = wishlistProps.wishlistItems.find(
                    (wItem) => wItem.product.id === item.id
                  );
                  if (existingWishlistItem) {
                    wishlistProps.removeFromWishlist(existingWishlistItem.id);
                  } else {
                    wishlistProps.addToWishList(item.id);
                  }
                } else {
                  this.openModal(<Authentication smallVersion />);
                }
              }}
              onCartClick={(item: ClothItem) => {
                this.openModal(
                  <UICatalogModal productSlug={item.slug} />,
                  <Authentication smallVersion />
                );
              }}
            />
          );
        })}
      </div>
    );
  }
}

const __UICatalogProduct = withContextSelector(
  UserContext,
  CatalogProducts,
  (context) => ({
    isAuthenticated: context.isAuthenticated,
  })
);

const _UICatalogProduct = withContextSelector(
  ProductModalContext,
  __UICatalogProduct,
  (context) => ({
    toggleModal: context.toggleModal,
    setModalChildren: context.setModalChildren,
    isModalActive: context.isModalActive,
    modalChildren: context.modalChildren,
  })
);

const UICatalogProduct = withContextSelector(
  WishlistContext,
  _UICatalogProduct,
  (context) => ({
    wishlistItems: context.wishlistItems,
    loadingWishlist: context.loadingWishlist,
    addToWishList: context.addToWishlist,
    removeFromWishlist: context.removeFromWishlist,
  })
);

export default getWithTranslation(UICatalogProduct);
