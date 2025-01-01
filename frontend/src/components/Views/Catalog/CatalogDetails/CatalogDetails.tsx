import styles from "./CatalogDetails.module.scss";
import "swiper/css";
import "swiper/css/navigation";
import { ReactNode } from "react";
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
import { origin } from "../../../../../project.config.json";
import UIReact from "utils/classes/UIReact";
import {
  ClothesContextActions,
  ClothItem,
} from "components/Context/ClothesContext";
import { withContext } from "components/Context/ContextInjector";
import { ClothesContext, ClothesListContext } from "components/Context/ContextCollection";
import { debounce } from "utils/hooks/debounce";
import { ClothesListActions } from "components/Context/ClothesListContext";
import SpinnerLoader from "components/Loaders/SpinnerLoader";

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

class CatalogDetails extends UIReact<
  ClothesContextActions & ClothesListActions,
  ProductOptionsState
> {
  images = [tshirt, tshirt2, tshirt3, clothes];

  state = {
    selectedImage: null,
    selectedOptions: {
      color: "", // Default empty color
      size: "", // Default empty size
      quantity: 1,
    },
  };

  get slashOfID(): number {
    const pathname: string = location.pathname;
    const splittedPathname: string[] = pathname.split("/");
    const slashOfID: string = splittedPathname[4];
    return Number(slashOfID);
  }

  componentDidMount(): void {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    this.fetchData();

    window.addEventListener("popstate", this.fetchData, {
      signal: this.controller.signal,
    });
    window.addEventListener("pushstate", this.fetchData, {
      signal: this.controller.signal,
    });
    window.addEventListener("replacestate", this.fetchData, {
      signal: this.controller.signal,
    });
  }

  componentWillUnmount(): void {
    this.props.setData(null);
  }

  componentDidUpdate(prevProps: Readonly<ClothesContextActions>): void {
    if (prevProps.data !== this.props.data) {
      this.setSelectedImage(this.props.data?.catalogImages?.[0].image);
    }
  }

  fetchData = debounce(
    async () => await this.fetchDataProduct(this.slashOfID),
    250
  );

  async fetchDataProduct(productId: number): Promise<void> {
    try {
      const response: Response = await fetch(`${origin}${productId}/`, {
        signal: this.controller.signal,
      });
      if (!response.ok) {
        throw "Response wasn't ok, something went wrong!";
      }

      const data: ClothItem = await response.json();
      this.props.setData(data);
      console.log(this.props.data);
    } catch (err) {
      console.error(err);
    }
  }

  setSelectedImage(url: string): void {
    this.setState(
      (prevState) => ({
        ...prevState,
        selectedImage: url,
      }),
      () => console.log(this.state.selectedImage)
    );
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
    return (
      <>
        {/* Catalog Section */}
        <section className={styles["catalog-section"]}>
          {this.product}
        </section>
        <NavigationSection />
      </>
    );
  }

  get product(): ReactNode {
    const { selectedImage, selectedOptions } = this.state;

    if (this.props.loading) {
      return <SpinnerLoader />;
    } else if (this.props.error) {
      return <h1>Oops, something went wrong!!!</h1>
    }

    return (
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
              <div
                className={
                  styles["swiper-navigation-buttons-catalog-container"]
                }
              >
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
                {this.props.data?.catalogImages?.map(({ image }, index) => (
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
                <a
                  href={selectedImage}
                  data-fancybox="gallery"
                  data-src={selectedImage}
                >
                  <img
                    src={selectedImage}
                    alt="Selected Product"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </div>
              <div style={{ display: "none" }}>
                {this.props.data?.catalogImages
                  ?.filter(({ image }) => image !== selectedImage)
                  ?.map(({ image }, index) => (
                    <a href={image} data-fancybox="gallery" key={index} />
                  ))}
              </div>
            </InjectedUIFancybox>
          </div>
          <div className={styles["catalog-product-details"]}>
            <h1 className={styles["catalog-product-product-title"]}>
              {this.props.data?.title}
            </h1>
            <div className={styles["catalog-product-product-rating"]}>
              <img src={star5} alt="Rating" />
              <span>В наличии: 38</span>
            </div>
            <bdi className={styles["catalog-product-product-pricing"]}>
              <span className={styles["catalog-product-current-price"]}>
                {this.props.data?.price.toLocaleString()} сум
              </span>
              <span className={styles["catalog-product-original-price"]}>
                {this.props.data?.price.toLocaleString()} сум
              </span>
              <span className={styles["catalog-product-discount"]}>-40%</span>
            </bdi>
            <p className={styles["catalog-product-product-description"]}>
              {this.props.data?.description}
            </p>
            <div className={styles["hr-line"]}></div>
            <div className={styles["product-options"]}>
              <div className={styles["colors-section"]}>
                <h4>Select Colors</h4>
                <div className={styles["colors-container"]}>
                  {this.props.data?.colors?.map(({ color }) => (
                    <button
                      key={color}
                      className={`${styles["color-option"]} ${
                        selectedOptions.color === color ? styles["selected"] : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => this.handleOptionChange("color", color)}
                      aria-label={`Select ${color} color`}
                    >
                      {selectedOptions.color === color && (
                        <span className={styles["checkmark"]}>✔</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles["sizes-section"]}>
                <h4>Choose Size</h4>
                <div className={styles["sizes-container"]}>
                  {this.props.data?.sizes?.map(({ size }) => (
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
    );
  }
}

const UICatalog = withContext(ClothesListContext, withContext(ClothesContext, CatalogDetails));

export default UICatalog;
