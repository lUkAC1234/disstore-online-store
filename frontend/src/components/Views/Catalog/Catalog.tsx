import styles from "./Catalog.module.scss";
import { PureComponent, ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
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

const lang: string = i18next.language;

class Catalog extends PureComponent<CatalogProps, CatalogState> {

  images = [
    tshirt,
    tshirt2,
    tshirt3,
    clothes,
  ];

  state = {
    selectedImage: this.images[0],
  };

  handleImageClick = (image: string) => {
    this.setState({ selectedImage: image });
  };

  render(): ReactNode {
    const { selectedImage } = this.state;

    // Get all images for the swiper but exclude the selected image from Fancybox
    const imagesForFancybox = this.images.filter(image => image !== selectedImage);

    return (
      <>
        <section className={styles["catalog-section"]}>
          <div className={styles["catalog-container"]}>
            <div className={styles["catalog-link-way"]}>
              <Link to={`/${lang}/`}>
                Home
              </Link>
              <FontAwesomeIcon icon={faAngleRight} />
              <Link to={`/${lang}/catalog`}>
                Shop
              </Link>
              <FontAwesomeIcon icon={faAngleRight} />
              <Link to={`/${lang}/catalog/men`}>
                Men
              </Link>
              <FontAwesomeIcon icon={faAngleRight} />
              T-shirts
            </div>
            <div className={styles["catalog-wrapper"]}>
              <div className={styles["thumbnail-navigation"]}>
                <InjectedUIFancybox className={styles["Fancybox-container"]}>
                  <div className={styles["swiper-navigation-buttons-catalog-container"]}>
                    <div className={`swiper-button-prev ${styles["navigation-button-catalog-prev"]}`}></div>
                    <div className={`swiper-button-next ${styles["navigation-button-catalog-next"]}`}></div>
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
                        direction: 'horizontal',
                      },
                      360: {
                        slidesPerView: 3,
                        direction: 'horizontal',
                      },
                      992: {
                        direction: 'vertical',
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
                          className={`${styles["thumbnail"]} ${selectedImage === image ? styles["active"] : ""}`}
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
                  <div style={{ display: 'none' }}>
                    {imagesForFancybox.map((image, index) => (
                      <a href={image} data-fancybox="gallery" key={index}></a>
                    ))}
                  </div>
                </InjectedUIFancybox>
              </div>

              <div className={styles["catalog-product-details"]}>
                <h1 className={styles["catalog-product-product-title"]}>Куртка длинная длина AW24CR1-12-21215</h1>
                <div className={styles["catalog-product-product-rating"]}>
                  <img src={star5} alt="Rating" />
                  <span>В наличии: 38</span>
                </div>
                <bdi className={styles["catalog-product-product-pricing"]}>
                  <span className={styles["catalog-product-current-price"]}>$260</span>
                  <span className={styles["catalog-product-original-price"]}>$300</span>
                  <span className={styles["catalog-product-discount"]}>-40%</span>
                </bdi>
                <p className={styles["catalog-product-product-description"]}>
                  Эта графическая футболка идеально подходит для любого случая. Изготовленная из
                  мягкой и дышащей ткани, она обеспечивает превосходный комфорт и стиль.
                </p>
              </div>
            </div>
          </div>
        </section>

      </>
    );
  }
}

export default Catalog;
