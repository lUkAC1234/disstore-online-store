import styles from './Home.module.scss';
import { PureComponent, ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import clothes from "assets/main/images/layout/clothes.jpg";
import InjectedUIFancybox from "components/Fancybox/Fancybox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

class NewClothes extends PureComponent {
    render(): ReactNode {
        return (
            <section className={`swiper-section ${styles["new-clothes-section"]}`}>
                <div className={`swiper-main-container ${styles["new-clothes-container"]}`}>
                    <h2 className={`swiper-subtitle ${styles["new-clothes-subtitle"]} fade fadeInDown`}>
                        Новинки
                    </h2>
                    <InjectedUIFancybox className={styles["main-page-carousel-fancybox-container"]}>
                        <Swiper
                            className={styles["mySwiper-new-clothes"]}
                            modules={[Navigation]}
                            navigation={{
                                nextEl: `.${styles["loop-button-new-clothes-next"]}`,
                                prevEl: `.${styles["loop-button-new-clothes-prev"]}`,
                            }}
                            slidesPerView={4}
                            initialSlide={0}
                            grabCursor={true}
                            loop={true}
                            roundLengths={true}
                            speed={600}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1,
                                    spaceBetween: 10,
                                },
                                500: {
                                    slidesPerView: 1.5,
                                    spaceBetween: 10,
                                },
                                600: {
                                    slidesPerView: 2,
                                    spaceBetween: 15,
                                },
                                900: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                                1300: {
                                    slidesPerView: 4,
                                    spaceBetween: 25,
                                }
                            }}
                        >
                            {[...Array(5)].map((_, index) => {
                                const imageUrl = clothes;

                                return (
                                    <SwiperSlide key={index} className={styles["new-clothes-column"]}>
                                        <div className={styles["new-clothes-image-container"]}>
                                            <a href={imageUrl} data-fancybox="gallery" data-caption={`${imageUrl} ${index + 1}`}>
                                                <img
                                                    src={imageUrl}
                                                    alt={`Clothes ${index + 1}`}
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            </a>
                                        </div>
                                        <div className={styles["new-clothes-content"]}>
                                            <h4 className={styles["new-clothes-title"]}>
                                                Футболка с деталями из
                                            </h4>
                                            <bdi className={styles["new-clothes-price"]}>
                                                23,420,000 сум
                                                <span className={styles["original-price"]}>25,620,000 сум</span>
                                                <span className={styles["discount"]}>-20%</span>
                                            </bdi>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                            <div className={`${styles["swiper-buttons-together-right-container"]} ${styles["swiper-buttons-new-clothes-container"]}`}>
                                <div className={styles["loop-button-new-clothes-prev"]}>
                                    <FontAwesomeIcon icon={faAngleLeft} />
                                </div>
                                <div className={styles["loop-button-new-clothes-next"]}>
                                    <FontAwesomeIcon icon={faAngleRight} />
                                </div>
                            </div>
                        </Swiper>
                    </InjectedUIFancybox>

                    <div className={styles["view-all-clothes-link-container"]}>
                        <Link to={""} className={styles["view-all-clothes-link"]}>
                            Просмотреть все
                        </Link>
                    </div>
                </div>
            </section>
        );
    }
}

export default NewClothes;
