import styles from "./CatalogModal.module.scss";
import { ReactNode, ComponentType } from "react";
import "swiper/css";
import "swiper/css/navigation";
import star5 from "assets/main/images/main-page/5star.png";
import { withContextSelector } from "components/Context/ContextInjector";
import {
  CartContext,
  ClothesContext,
  ClothesListContext,
  ProductModalContext,
} from "components/Context/ContextCollection";
import BaseCatalogDetails from "../Base/BaseCatalogDetails";
import SizeSelector from "../SelectedOptions/Sizes/SizeSelector";
import ColorSelector from "../SelectedOptions/Colors/ColorSelector";
import QuantitySelector from "../SelectedOptions/Quantity/QuantitySelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import BlockLoader from "components/UI/BlockLoaders/BlockLoader";
import OptimizedImage from "components/UI/OptimizedImage/OptimizedImage";
import LangLink from "components/UI/Link/LangLink";

interface CatalogDetailsModalProps {
  productSlug: string;
}

class CatalogDetailsModal extends BaseCatalogDetails<CatalogDetailsModalProps> {
  getProductSlug(): string {
    return this.props.productSlug;
  }

  renderContent(): ReactNode {
    const { selectedOptions, data } = this.props;
    const maxAvailable = data?.count;

    return (
      <div className={styles["catalog-modal-container"]}>
        <div className={styles["catalog-modal-left-side"]}>
          <div className={styles["catalog-modal-image-container"]}>
            <OptimizedImage
              src={data?.catalogImages[0].image}
              thumbnail={data?.catalogImages[0].thumbnail}
              alt={data?.title || "Рисунок"}
            />
          </div>
          <BlockLoader
            isLoaded={!!data}
            containerStyle={{ height: "2rem" }}
          >
            <LangLink
              className={styles["catalog-modal-item-link"]}
              to={`/catalog/clothes/${data?.slug}`}
            >
              <span>Вся информация о товаре </span>
              <FontAwesomeIcon icon={faAngleRight} />
            </LangLink>
          </BlockLoader>
        </div>
        <div className={styles["catalog-modal-right-side"]}>

          <div className={styles["catalog-modal-content"]}>
            <BlockLoader
              isLoaded={!!data?.title}
            >
              <h2 className={styles["catalog-modal-title"]}>{data?.title}</h2>
            </BlockLoader>
            <BlockLoader isLoaded={maxAvailable >= 0} containerStyle={{ height: "2rem" }}>
              <div className={styles["catalog-modal-product-rating"]}>
                <img src={star5} alt="Rating" />
                <span>
                  {maxAvailable > 0
                    ? `В наличии: ${data.count}`
                    : "Товар закончился"}
                </span>
              </div>
            </BlockLoader>
            <BlockLoader isLoaded={!!data?.price}>
              <div className={styles["hr-line"]} />
              <bdi className={styles["catalog-modal-product-pricing"]}>
                <span
                  className={styles["catalog-modal-product-current-price"]}
                >
                  {data?.real_price.toLocaleString("en-US")} сум
                </span>
                {data?.discount > 0 && (
                  <>
                    <span
                      className={styles["catalog-modal-product-original-price"]}
                    >
                      {data?.price.toLocaleString("en-US")} сум
                    </span>
                    <span
                      className={styles["catalog-modal-product-discount"]}
                    >
                      -{data?.discount}%
                    </span>
                  </>
                )}
              </bdi>
              <div className={styles["hr-line"]} />
            </BlockLoader>
            <div className={styles["product-options"]}>
              <BlockLoader
                isLoaded={!!data?.colors}
              >
                <ColorSelector
                  data={data}
                  selectedOptions={selectedOptions}
                  handleOptionChange={this.handleOptionChange}
                />
              </BlockLoader>
              <BlockLoader
                isLoaded={!!data?.sizes}
              >
                <SizeSelector
                  data={data}
                  selectedOptions={selectedOptions}
                  handleOptionChange={this.handleOptionChange}
                />
              </BlockLoader>
              <BlockLoader
                isLoaded={maxAvailable >= 0}
              >
                <QuantitySelector
                  data={data}
                  maxAvailable={maxAvailable}
                  globalQuantity={this.getGlobalQuantity}
                  addToCart={this.handleAddToCart}
                  selectedOptions={selectedOptions}
                  handleOptionChange={this.handleOptionChange}
                />
              </BlockLoader>
            </div>
          </div>
        </div >
      </div >
    );
  }

}

export type CatalogDetailsModalExternalProps = {
  productSlug: string;
};

const ___UICatalogDetailsModal = withContextSelector(ClothesListContext, CatalogDetailsModal, (context) => ({
  error: context.error,
}));

const __UICatalogDetailsModal = withContextSelector(ProductModalContext, ___UICatalogDetailsModal, (context) => ({
  toggleModal: context.toggleModal,
  setModalChildren: context.setModalChildren,
  isModalActive: context.isModalActive,
  modalChildren: context.modalChildren,
}));

const _UICatalogDetailsModal = withContextSelector(ClothesContext, __UICatalogDetailsModal, (context) => ({
  data: context.data,
  setData: context.setData,
}));

const UICatalogDetailsModal = withContextSelector(CartContext, _UICatalogDetailsModal, (context) => ({
  setSelectedOptions: context.setSelectedOptions,
  cart: context.cart,
  selectedOptions: context.selectedOptions,
  addToCart: context.addToCart,
}));

const UICatalogModal = UICatalogDetailsModal as ComponentType<CatalogDetailsModalExternalProps>;

export default UICatalogModal;