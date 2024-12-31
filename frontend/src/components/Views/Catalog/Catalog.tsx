import styles from "./Catalog.module.scss";
import "swiper/css";
import "swiper/css/navigation";
import { PureComponent, ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import tshirt from "assets/main/images/catalog/tshirt.png";
import tshirt2 from "assets/main/images/catalog/tshirt2.png";
import tshirt3 from "assets/main/images/catalog/tshirt3.png";
import clothes from "assets/main/images/layout/clothes.jpg";
import { Navigation } from "swiper/modules";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import star5 from "assets/main/images/main-page/5star.png";
import { Link } from "react-router-dom";
import i18next from "i18next";
import InjectedUIFancybox from "components/Fancybox/Fancybox";
import NavigationSection from "./Navigation/Navigation";

const lang: string = i18next.language;

// interface ProductOptionsProps {
//   productOptions: {
//     colors: { name: string; hex: string }[];
//     sizes: string[];
//   };
// }

interface ProductOptionsState {
  selectedOptions: {
    color: string;
    size: string;
    quantity: number;
  };
  selectedImage: string;
}

const defaultProductOptions = {
  colors: [
    { name: "brown", hex: "#5c4934" },
    { name: "green", hex: "#3e5b43" },
    { name: "navy", hex: "#313553" },
  ],
  sizes: ["Small", "Medium", "Large", "X-Large"],
};

class Catalog extends PureComponent<object, ProductOptionsState> {
  images = [tshirt, tshirt2, tshirt3, clothes];

  state = {
    selectedImage: this.images[0],
    selectedOptions: {
      color: defaultProductOptions.colors[0]?.name || "",
      size: defaultProductOptions.sizes[0] || "",
      quantity: 1,
    },
  };

  componentDidMount(): void {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  handleOptionChange = (optionType: string, value: string | number) => {
    this.setState((prevState) => ({
      selectedOptions: {
        ...prevState.selectedOptions,
        [optionType]: value,
      },
    }));
  };

  handleQuantityChange = (type: "increase" | "decrease") => {
    this.setState((prevState) => ({
      selectedOptions: {
        ...prevState.selectedOptions,
        quantity:
          type === "increase"
            ? prevState.selectedOptions.quantity + 1
            : Math.max(1, prevState.selectedOptions.quantity - 1),
      },
    }));
  };

  handleImageClick = (image: string) => {
    this.setState({ selectedImage: image });
  };

  render(): ReactNode {
    const { selectedImage, selectedOptions } = this.state;

    return (
      <>
        {/* Catalog Section */}
        <section className={styles["catalog-section"]}>
          <div className={styles["catalog-container"]}>
            <div className={styles["catalog-link-way"]}>
              <Link to={`/${lang}/`}>Home</Link>
              <FontAwesomeIcon icon={faAngleRight} />
              <Link to={`/${lang}/catalog`}>Shop</Link>
              <FontAwesomeIcon icon={faAngleRight} />
              <Link to={`/${lang}/catalog/men`}>Men</Link>
              <FontAwesomeIcon icon={faAngleRight} />
              T-shirts
            </div>
            <div className={styles["catalog-wrapper"]}>
              <div className={styles["thumbnail-navigation"]}>
                <InjectedUIFancybox className={styles["Fancybox-container"]}>
                  <div className={styles["swiper-navigation-buttons-catalog-container"]}>
                    <div
                      className={`swiper-button-prev ${styles["navigation-button-catalog-prev"]}`}
                    ></div>
                    <div
                      className={`swiper-button-next ${styles["navigation-button-catalog-next"]}`}
                    ></div>
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
                      0: {
                        slidesPerView: 2,
                        direction: "horizontal",
                      },
                      360: {
                        slidesPerView: 3,
                        direction: "horizontal",
                      },
                      992: {
                        direction: "vertical",
                        slidesPerView: 3,
                      },
                    }}
                  >
                    {this.images.map((image, index) => (
                      <SwiperSlide
                        key={index}
                        onClick={() => this.handleImageClick(image)}
                        className={styles["thumbnail-slide"]}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className={`${styles["thumbnail"]} ${
                            selectedImage === image ? styles["active"] : ""
                          }`}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className={styles["catalog-main-image"]}>
                    <a href={selectedImage} data-fancybox="gallery" data-src={selectedImage}>
                      <img
                        src={selectedImage}
                        alt="Selected Product"
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                  </div>
                  <div style={{ display: "none" }}>
                    {this.images
                      .filter((image) => image !== selectedImage)
                      .map((image, index) => (
                        <a href={image} data-fancybox="gallery" key={index}></a>
                      ))}
                  </div>
                </InjectedUIFancybox>
              </div>
              <div className={styles["catalog-product-details"]}>
                <h1 className={styles["catalog-product-product-title"]}>
                  Куртка длинная длина AW24CR1-12-21215
                </h1>
                <div className={styles["catalog-product-product-rating"]}>
                  <img src={star5} alt="Rating" />
                  <span>В наличии: 38</span>
                </div>
                <bdi className={styles["catalog-product-product-pricing"]}>
                  <span className={styles["catalog-product-current-price"]}>2,620,000 сум</span>
                  <span className={styles["catalog-product-original-price"]}>2,620,000 сум</span>
                  <span className={styles["catalog-product-discount"]}>-40%</span>
                </bdi>
                <p className={styles["catalog-product-product-description"]}>
                  Эта графическая футболка идеально подходит для любого случая. Изготовленная из
                  мягкой и дышащей ткани, она обеспечивает превосходный комфорт и стиль.
                </p>
                <div className={styles["hr-line"]}></div>
                <div className={styles["product-options"]}>
                  <div className={styles["colors-section"]}>
                    <h4>Select Colors</h4>
                    <div className={styles["colors-container"]}>
                      {defaultProductOptions.colors.map((color) => (
                        <button
                          key={color.name}
                          className={`${styles["color-option"]} ${
                            selectedOptions.color === color.name ? styles["selected"] : ""
                          }`}
                          style={{ backgroundColor: color.hex }}
                          onClick={() => this.handleOptionChange("color", color.name)}
                          aria-label={`Select ${color.name} color`}
                        >
                          {selectedOptions.color === color.name && (
                            <span className={styles["checkmark"]}>✔</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles["sizes-section"]}>
                    <h4>Choose Size</h4>
                    <div className={styles["sizes-container"]}>
                      {defaultProductOptions.sizes.map((size) => (
                        <button
                          key={size}
                          className={`${styles["size-option"]} ${
                            selectedOptions.size === size ? styles["selected"] : ""
                          }`}
                          onClick={() => this.handleOptionChange("size", size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles["quantity-section"]}>
                    <div className={styles["quantity-container"]}>
                      <button
                        className={styles["quantity-btn"]}
                        onClick={() => this.handleQuantityChange("decrease")}
                      >
                        -
                      </button>
                      <span className={styles["quantity-value"]}>
                        {selectedOptions.quantity}
                      </span>
                      <button
                        className={styles["quantity-btn"]}
                        onClick={() => this.handleQuantityChange("increase")}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button className={styles["add-to-cart-btn"]}>Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <NavigationSection />
      </>
    );
  }
}

export default Catalog;
