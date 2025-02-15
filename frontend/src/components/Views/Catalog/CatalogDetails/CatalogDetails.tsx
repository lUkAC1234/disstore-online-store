// CatalogDetails.tsx
import React, { ReactNode } from "react";
import styles from "./CatalogDetails.module.scss";
import "swiper/css";
import "swiper/css/navigation";
import NavigationSection from "./Navigation/Navigation";
import i18next from "i18next";
import { withContext } from "components/Context/ContextInjector";
import { CartContext, ClothesContext, ClothesListContext } from "components/Context/ContextCollection";
import BaseCatalogDetails, { BaseCatalogState } from "./BaseCatalogDetails";
import star5 from "assets/main/images/main-page/5star.png";
import { WithTranslation } from "react-i18next";
import { getWithTranslation } from "i18n/hooks";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import InjectedUIFancybox from "components/Fancybox/Fancybox";
import { Navigation } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";

import { Swiper as OriginalSwiper } from "swiper/react";
const Swiper = OriginalSwiper as unknown as React.FC<any>;

interface CatalogDetailsProps extends BaseCatalogState, WithTranslation { }

class CatalogDetails extends BaseCatalogDetails<CatalogDetailsProps> {
  // Extract product slug from URL
  getProductSlug(): string {
    const { pathname } = location;
    const parts = pathname.split("/");
    return parts[4];
  }

  // Use current language from i18next
  get lang(): string {
    return this.props.i18n.language;
  }

  // Enhance componentDidMount for smooth scroll and attach events
  componentDidMount = async (): Promise<void> => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    await super.componentDidMount();
    // Attach events with the controller signal to auto-abort if needed
    window.addEventListener("popstate", this.fetchData, { signal: this.controller.signal });
    window.addEventListener("pushstate", this.fetchData, { signal: this.controller.signal });
    window.addEventListener("replacestate", this.fetchData, { signal: this.controller.signal });
  };

  // Render the full-page catalog UI
  renderContent(): ReactNode {
    const { selectedImage, selectedOptions } = this.state;
    const { data } = this.props;
    const maxAvailable = data?.count;

    return (
      <div className={styles["catalog-container"]}>
        <div className="catalog-link-way">
          <Link to={`/${this.lang}/`}>Главная</Link>
          <FontAwesomeIcon icon={faAngleRight} />
          <Link to={`/${this.lang}/catalog`}>Каталог</Link>
          <FontAwesomeIcon icon={faAngleRight} />
          {data?.title}
        </div>
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
                      className={`${styles["thumbnail"]} ${selectedImage === image ? styles["active"] : ""}`}
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
              </Swiper>
              <div className={styles["catalog-main-image"]}>
                <a href={selectedImage} data-fancybox="gallery" data-src={selectedImage}>
                  {data?.catalogImages?.[0]?.thumbnail ? (
                    <img
                      src={data.catalogImages[0].thumbnail}
                      alt={data.title || "Рисунок"}
                      loading="lazy"
                      decoding="async"
                      onLoad={({ target }) => {
                        if (selectedImage) {
                          const temp = new Image();
                          temp.src = selectedImage;
                          temp.onload = () => (target as HTMLImageElement).src = selectedImage;
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
                  ?.filter(({ image }) => image !== selectedImage)
                  ?.map(({ image }, index) => (
                    <a href={image} data-fancybox="gallery" key={index} />
                  ))}
              </div>
            </InjectedUIFancybox>
          </div>
          <div className={styles["catalog-product-details"]}>
            <h1 className={styles["catalog-product-product-title"]}>{data?.title}</h1>
            <div className={styles["catalog-product-product-rating"]}>
              <img src={star5} alt="Rating" />
              <span>
                {data?.count > 0 ? `В наличии: ${data.count}` : "Товар закончился"}
              </span>
            </div>
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
            <p className={styles["catalog-product-description"]}>{data?.short_description}</p>
            <div className={styles["hr-line"]} />
            <div className={styles["product-options"]}>
              <div className={styles["colors-section"]}>
                <h4 className={styles["product-options-title"]}>Выберите цвет</h4>
                <div className={styles["colors-container"]}>
                  {data?.colors?.map(({ color }) => (
                    <button
                      key={color}
                      className={`${styles["color-option"]} ${selectedOptions.color === color ? styles["selected"] : ""
                        }`}
                      style={{ backgroundColor: color }}
                      onClick={() => this.handleOptionChange("color", color)}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </div>
              <div className={styles["hr-line"]} />
              <div className={styles["sizes-section"]}>
                <h4 className={styles["product-options-title"]}>Выберите размер</h4>
                <div className={styles["sizes-container"]}>
                  {data?.sizes?.map(({ size }) => (
                    <button
                      key={size}
                      className={`${styles["size-option"]} ${selectedOptions.size === size ? styles["selected"] : ""
                        }`}
                      onClick={() => this.handleOptionChange("size", size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles["hr-line"]} />
              <div className={styles["quantity-section"]}>
                <div className={styles["quantity-container"]}>
                  <div className={styles["quantity-wrapper"]}>
                    <button
                      className={styles["quantity-btn"]}
                      onClick={() => this.handleQuantityChange("decrease", maxAvailable)}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className={styles["quantity-value"]}>
                      {this.state.selectedOptions.quantity}
                    </span>
                    <button
                      className={styles["quantity-btn"]}
                      onClick={() => this.handleQuantityChange("increase", maxAvailable)}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                  <button onClick={() => this.props.addToCart(data.id)}  disabled={data?.count <= 0} className={styles["catalog-add-to-cart-btn"]}>
                    Добавить в корзину
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NavigationSection
          long_description={this.props.data?.long_description}
          reviews={this.props.data?.reviews}
          faqs={this.props.data?.faqs}
        />
      </div>
    );
  }
}

const UICatalog = getWithTranslation(withContext(ClothesListContext, withContext(ClothesContext, withContext(CartContext, CatalogDetails))));
export default UICatalog;
