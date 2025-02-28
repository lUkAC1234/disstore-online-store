import { ReactNode } from "react";
import { ClothItem } from "components/Context/ClothesContext";
import { WishlistItem } from "components/Context/WishlistContext";
import { withContextSelector } from "components/Context/ContextInjector";
import { ProductModalContext, UserContext, WishlistContext } from "components/Context/ContextCollection";
import { ModalHandler } from "components/Modal/Modal.utils";
import UICatalogModal from "../../CatalogDetails/CatalogModal/CatalogDetailsModal";
import Authentication from "components/Views/Authentication/Authentication";
import CatalogItem from "./CatalogItem/CatalogItem";
import styles from "./Products.module.scss";
import { getWithTranslation } from "i18n/hooks";
import { WithTranslation } from "react-i18next";

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

class CatalogProducts extends ModalHandler<CatalogProductsProps, { pathname: string }> {
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
              lang={this.props.i18n.language}
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

const TranslatedCatalog = getWithTranslation(CatalogProducts);

const ___UICatalogProduct = withContextSelector(
  UserContext,
  TranslatedCatalog,
  (context) => ({
    isAuthenticated: context.isAuthenticated,
  })
);

const __UICatalogProduct = withContextSelector(
  ProductModalContext,
  ___UICatalogProduct,
  (context) => ({
    toggleModal: context.toggleModal,
    setModalChildren: context.setModalChildren,
    isModalActive: context.isModalActive,
    modalChildren: context.modalChildren,
  })
);

const _UICatalogProduct = withContextSelector(
  WishlistContext,
  __UICatalogProduct,
  (context) => ({
    wishlistItems: context.wishlistItems,
    loadingWishlist: context.loadingWishlist,
    addToWishList: context.addToWishlist,
    removeFromWishlist: context.removeFromWishlist,
  })
);

export default _UICatalogProduct;
