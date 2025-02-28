import { FC, ReactNode } from "react";
import styles from "./CatalogDetails.module.scss";
import "swiper/css";
import "swiper/css/navigation";
import NavigationSection from "./Navigation/Navigation";
import { withContextSelector } from "components/Context/ContextInjector";
import {
  CartContext,
  ClothesContext,
  ClothesListContext,
} from "components/Context/ContextCollection";
import BaseCatalogDetails from "./Base/BaseCatalogDetails";
import star5 from "assets/main/images/main-page/5star.png";
import { WithTranslation } from "react-i18next";
import { getWithTranslation } from "i18n/hooks";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faImage } from "@fortawesome/free-solid-svg-icons";
import InjectedUIFancybox from "components/Fancybox/Fancybox";
import { Navigation } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
import { Swiper as OriginalSwiper } from "swiper/react";
import ColorSelector from "./SelectedOptions/Colors/ColorSelector";
import SizeSelector from "./SelectedOptions/Sizes/SizeSelector";
import QuantitySelector from "./SelectedOptions/Quantity/QuantitySelector";
import BlockLoader from "components/BlockLoaders/BlockLoader";
const Swiper = OriginalSwiper as unknown as FC<any>;

interface CatalogDetailsProps extends WithTranslation {
  
}

class CatalogDetails extends BaseCatalogDetails<CatalogDetailsProps> {
  getProductSlug(): string {
    const { pathname } = location;
    const parts = pathname.split("/");
    return parts[4];
  }

  get lang(): string {
    return this.props.i18n.language;
  }

  componentDidMount = async (): Promise<void> => {
    await super.componentDidMount();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.addEventListener("popstate", this.fetchData, { signal: this.controller.signal });
    window.addEventListener("pushstate", this.fetchData, { signal: this.controller.signal });
    window.addEventListener("replacestate", this.fetchData, { signal: this.controller.signal });
  };

  renderContent(): ReactNode {
    const { selectedOptions, data } = this.props;
    const maxAvailable = data?.count;

    const emptyLoaderSlides = [0, 1, 2].map((index) => {
      const imageAvailable = !!data?.catalogImages?.[index]?.image;
      return (
        !imageAvailable && (
          <SwiperSlide key={index}>
            <BlockLoader
              isLoaded={imageAvailable}
              className={styles["catalog-details-swiper-loader"]}
              loadingMessage={<FontAwesomeIcon icon={faImage} />}
            >

            </BlockLoader>
          </SwiperSlide>
        )
      );
    });

    return (
      <div className={styles["catalog-container"]}>
        <BlockLoader isLoaded={!!data} containerStyle={{ width: "min(100%, 30rem)", height: "2rem", marginBottom: "3rem", marginLeft: "0.75rem" }}>
          <div className="catalog-link-way" style={{ marginLeft: "0.5rem" }}>
            <Link to={`/${this.lang}/`}>Главная</Link>
            <FontAwesomeIcon icon={faAngleRight} />
            <Link to={`/${this.lang}/catalog`}>Каталог</Link>
            <FontAwesomeIcon icon={faAngleRight} />
            {data?.title}
          </div>
        </BlockLoader>

        <div className={styles["catalog-wrapper"]}>
          <div className={styles["thumbnail-navigation"]}>
            <InjectedUIFancybox className={styles["Fancybox-container"]}>
              <div
                className={styles["swiper-navigation-buttons-catalog-container"]}
                style={{ display: data?.catalogImages?.length > 3 ? "flex" : "none" }}
              >
                <div className={`swiper-button-prev ${styles["navigation-button-catalog-prev"]}`} />
                <div className={`swiper-button-next ${styles["navigation-button-catalog-next"]}`} />
              </div>
              <Swiper
                direction="vertical"
                spaceBetween={10}
                className={styles["thumbnail-swiper"]}
                slidesPerView={3}
                initialSlide={0}
                grabCursor={true}
                modules={[Navigation]}
                navigation={{
                  nextEl: `.${styles["navigation-button-catalog-next"]}`,
                  prevEl: `.${styles["navigation-button-catalog-prev"]}`,
                }}
                breakpoints={{
                  0: { slidesPerView: 2, direction: "horizontal" },
                  361: { slidesPerView: 3, direction: "horizontal" },
                  1101: { direction: "vertical", slidesPerView: 3 },
                }}
              >
                {data?.catalogImages?.map(({ thumbnail, image }, index) => (
                  <SwiperSlide
                    key={index}
                    onClick={() => this.handleImageClick(image)}
                    className={styles["thumbnail-slide"]}
                  >
                    <img
                      src={thumbnail}
                      alt={`Thumbnail ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className={`${styles["thumbnail"]} ${selectedOptions.selectedImage === image ? styles["active"] : ""
                        }`}
                      onLoad={({ target }) => {
                        const temp = new Image();
                        temp.src = image;
                        temp.onload = () => {
                          (target as HTMLImageElement).src = image;
                        };
                      }}
                    />
                  </SwiperSlide>
                ))}
                {emptyLoaderSlides}
              </Swiper>
              <div className={styles["catalog-main-image"]}>
                <a
                  href={selectedOptions.selectedImage || ""}
                  data-fancybox="gallery"
                  data-src={selectedOptions.selectedImage || ""}
                >
                  {data?.catalogImages?.[0]?.thumbnail ? (
                    <img
                      src={data.catalogImages[0].thumbnail}
                      alt={data.title || "Рисунок"}
                      loading="lazy"
                      decoding="async"
                      onLoad={({ target }) => {
                        if (selectedOptions.selectedImage) {
                          const temp = new Image();
                          temp.src = selectedOptions.selectedImage;
                          temp.onload = () =>
                            (target as HTMLImageElement).src = selectedOptions.selectedImage;
                        }
                      }}
                    />
                  ) : (
                    <SpinnerLoaderWrapper />
                  )}
                </a>
              </div>
              <div style={{ display: "none" }}>
                {data?.catalogImages
                  ?.filter(({ image }) => image !== selectedOptions.selectedImage)
                  ?.map(({ image }, index) => (
                    <a href={image} data-fancybox="gallery" key={index} />
                  ))}
              </div>
            </InjectedUIFancybox>
          </div>
          <div className={styles["catalog-product-details"]}>
            <BlockLoader
              isLoaded={!!data?.title}
            >
              <h1 className={styles["catalog-product-product-title"]}>{data?.title}</h1>
            </BlockLoader>
            <BlockLoader isLoaded={maxAvailable >= 0}>
              <div className={styles["catalog-product-product-rating"]}>
                <img src={star5} alt="Rating" />
                <span>
                  {maxAvailable > 0 ? `В наличии: ${data.count}` : "Товар закончился"}
                </span>
              </div>
            </BlockLoader>

            <BlockLoader isLoaded={!!data?.price}>
              <bdi className={styles["catalog-product-product-pricing"]}>
                <span className={styles["catalog-product-current-price"]}>
                  {data?.real_price.toLocaleString("en-US")} сум
                </span>
                {data?.discount > 0 && (
                  <>
                    <span className={styles["catalog-product-original-price"]}>
                      {data?.price.toLocaleString("en-US")} сум
                    </span>
                    <span className={styles["catalog-product-discount"]}>
                      -{data?.discount}%
                    </span>
                  </>
                )}
              </bdi>
            </BlockLoader>

            <BlockLoader isLoaded={!!data?.short_description}>
              <p className={styles["catalog-product-description"]}>{data?.short_description}</p>
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
                <div className={styles["hr-line"]} />
              </BlockLoader>
              <BlockLoader
                isLoaded={!!data?.sizes}
              >
                <SizeSelector
                  data={data}
                  selectedOptions={selectedOptions}
                  handleOptionChange={this.handleOptionChange}
                />
                <div className={styles["hr-line"]} />
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
                  positionStatic
                />
              </BlockLoader>
            </div>
          </div>
        </div>
        <BlockLoader isLoaded={!!data}>
          <NavigationSection
            long_description={data?.long_description}
            reviews={data?.reviews}
            faqs={data?.faqs}
          />
        </BlockLoader>
      </div>
    );
  }
}


const __UICatalog = withContextSelector(
  CartContext,
  CatalogDetails,
  (context) => ({
    setSelectedOptions: context.setSelectedOptions,
    cart: context.cart,
    selectedOptions: context.selectedOptions,
    addToCart: context.addToCart,
  })
);

const _UICatalog = withContextSelector(
  ClothesContext,
  __UICatalog,
  (context) => ({
    data: context.data,
    setData: context.setData,
  })
);

const UICatalog = withContextSelector(
  ClothesListContext,
  _UICatalog,
  (context) => ({
    error: context.error,
  })
);

export default getWithTranslation(UICatalog);
