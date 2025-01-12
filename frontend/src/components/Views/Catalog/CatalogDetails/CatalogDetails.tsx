import styles from "./CatalogDetails.module.scss";
import "swiper/css";
import "swiper/css/navigation";
import { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { faAngleRight, faCheck, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
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
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";
const lang: string = i18next.language;

interface ProductOptionsState {
  selectedOptions: {
    color: string;
    size: string;
    quantity: number;
  };
  selectedImage: string | null;
}

class CatalogDetails extends UIReact<
  ClothesContextActions & ClothesListActions,
  ProductOptionsState
> {

  state: ProductOptionsState = {
    selectedImage: null,
    selectedOptions: {
      color: "",
      size: "",
      quantity: this.props.data?.count <= 0 ? 0 : 1,
    },
  };

  get slashOfSlug(): string {
    const pathname: string = location.pathname;
    const splittedPathname: string[] = pathname.split("/");
    const slashOfID: string = splittedPathname[4];
    return slashOfID;
  }


  async componentDidMount(): Promise<void> {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });


    await this.fetchData();

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
    super.componentWillUnmount();
    this.props.setData(null);
  }

  componentDidUpdate(prevProps: Readonly<ClothesContextActions>): void {
    if (prevProps.data !== this.props.data && this.props.data) {
      const { colors, sizes, catalogImages } = this.props.data;
      this.setState((prevState) => ({
        selectedOptions: {
          color: prevState.selectedOptions.color || colors?.[0]?.color || "",
          size: prevState.selectedOptions.size || sizes?.[0]?.size || "",
          quantity: this.props.data?.count <= 0 ? 0 : prevState.selectedOptions.quantity,
        },
        selectedImage: prevState.selectedImage || catalogImages?.[0]?.image || null,
      }));
    }
  }

  fetchData = debounce(
    async () => {
      await this.fetchDataProduct(this.slashOfSlug);
    }, 100
  );

  async fetchDataProduct(productSlug: string): Promise<void> {
    try {
      const cachedData = sessionStorage.getItem(productSlug);

      if (cachedData) {
        const data: ClothItem = JSON.parse(cachedData);
        this.props.setData(data);
        return;
      }

      const response: Response = await fetch(`${origin}/clothes/${productSlug}/`, {
        signal: this.controller.signal,
      });

      if (!response.ok) {
        if (response.status === 404) {
          window.location.href = `/${lang}/page-not-found-404`;
          return;
        }
        throw new Error("Не удалось загрузить данные");
      }

      const data: ClothItem = await response.json();
      sessionStorage.setItem(productSlug, JSON.stringify(data));
      this.props.setData(data);
    } catch (err) {
      return;
    }
  }


  setSelectedImage(url: string): void {
    this.setState(
      (prevState) => ({
        ...prevState,
        selectedImage: url,
      }),
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

  handleQuantityChange = (type: "increase" | "decrease", maxAvailable: number): void => {
    this.setState(({ selectedOptions }) => ({
      selectedOptions: {
        ...selectedOptions,
        quantity: Math.min(
          Math.max(type === "increase" ? selectedOptions.quantity + 1 : selectedOptions.quantity - 1, 1),
          maxAvailable,
          100
        ),
      },
    }));
  };

  handleImageClick = (image: string): void => {
    this.setState({ selectedImage: image });
  };

  render(): ReactNode {
    if (this.props.loading) {
      return <SpinnerLoaderWrapperFixed />;
    }

    if (this.props.error) {
      return (
        <div className={styles["catalog-container"]}>
          <h2>Ойй, что-то пошло не так !</h2>
        </div>
      );
    }

    return (
      <>
        <section className={styles["catalog-section"]}>
          {this.props.loading ? (
            <SpinnerLoaderWrapperFixed />
          ) : this.product}
        </section>
        <NavigationSection
          long_description={this.props.data?.long_description}
          reviews={this.props.data?.reviews}
          faqs={this.props.data?.faqs}
        />
      </>
    );
  }

  get product(): ReactNode {
    const { selectedImage, selectedOptions } = this.state;
    const maxAvailable = this.props.data?.count;

    return (

      <div className={styles["catalog-container"]}>
        <div className="catalog-link-way">
          <Link to={`/${lang}/`}>Главная</Link>
          <FontAwesomeIcon icon={faAngleRight} />
          <Link to={`/${lang}/catalog`}>Каталог</Link>
          <FontAwesomeIcon icon={faAngleRight} />
          {this.props.data?.title}
        </div>
        <div className={styles["catalog-wrapper"]}>
          <div className={styles["thumbnail-navigation"]}>
            <InjectedUIFancybox className={styles["Fancybox-container"]}>
              <div
                className={
                  styles["swiper-navigation-buttons-catalog-container"]
                }
                style={{
                  display: this.props.data?.catalogImages?.length > 3 ? "flex" : "none",
                }}
              >
                <div className={`
                    swiper-button-prev
                    ${styles["navigation-button-catalog-prev"]}`}>
                </div>
                <div className={`
                    swiper-button-next
                    ${styles["navigation-button-catalog-next"]}`}>
                </div>
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
                  361: {
                    slidesPerView: 3,
                    direction: "horizontal",
                  },
                  1101: {
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
                      loading="lazy"
                      decoding="async"
                      className={`${styles["thumbnail"]} ${selectedImage === image ? styles["active"] : ""}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className={styles["catalog-main-image"]}>
                {selectedImage ? (
                  <a
                    href={selectedImage}
                    data-fancybox="gallery"
                    data-src={selectedImage}
                  >
                    <img
                      src={selectedImage}
                      alt="Выбранный рисунок"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                ) : (
                  <SpinnerLoaderWrapper />
                )}
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
              <span>
                {this.props.data?.count > 0 ? `В наличии: ${this.props.data.count}` : "Товар закончился"}
              </span>
            </div>
            <bdi className={styles["catalog-product-product-pricing"]}>
              <span className={styles["catalog-product-current-price"]}>
                {this.props.data?.real_price.toLocaleString('en-US')} сум
              </span>
              {this.props.data?.discount > 0 ? (
                <>
                  <span className={styles["catalog-product-original-price"]}>
                    {this.props.data?.price.toLocaleString('en-US')} сум
                  </span>
                  <span className={styles["catalog-product-discount"]}>
                    -{this.props.data?.discount}%
                  </span>
                </>
              ) : (
                null
              )}
            </bdi>
            <p className={styles["catalog-product-description"]}>
              {this.props.data?.short_description}
            </p>
            <div className={styles["hr-line"]}></div>
            <div className={styles["product-options"]}>
              <div className={styles["colors-section"]}>
                <h4 className={styles["product-options-title"]}>Выберите цвет</h4>
                <div className={styles["colors-container"]}>
                  {this.props.data?.colors?.map(({ color }) => (
                    <button
                      key={color}
                      className={`
                        ${styles["color-option"]}
                        ${selectedOptions.color === color ? styles["selected"] : ""}
                      `}
                      style={{ backgroundColor: color }}
                      onClick={() => this.handleOptionChange("color", color)}
                      aria-label={`Select ${color} color`}
                    >
                      {selectedOptions.color === color && (
                        <span className={styles["catalog-checkmark"]}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles["hr-line"]}></div>

              <div className={styles["sizes-section"]}>
                <h4 className={styles["product-options-title"]}>Выберите размер</h4>
                <div className={styles["sizes-container"]}>
                  {this.props.data?.sizes?.map(({ size }) => (
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

              <div className={styles["hr-line"]}></div>

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

                  <button disabled={this.props.data?.count <= 0} className={styles["catalog-add-to-cart-btn"]}>
                    Добавить в корзину
                  </button>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    );
  }
}

const UICatalog = withContext(ClothesListContext, withContext(ClothesContext, CatalogDetails));

export default UICatalog;
