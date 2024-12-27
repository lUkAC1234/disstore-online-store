import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PureComponent, ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import clothes from "assets/main/images/layout/clothes.jpg";
import InjectedUIFancybox from "components/Fancybox/Fancybox";

class TopSelling extends PureComponent {
    render(): ReactNode {
        return (
            <section className="swiper-section top-selling-section">
                <div className="swiper-main-container top-selling-container">
                    <h2 className="swiper-subtitle top-selling-subtitle fade fadeInDown">
                        Популярные
                    </h2>
                    <InjectedUIFancybox>
                        <Swiper
                            className="mySwiper-top-selling"
                            modules={[Navigation]}
                            navigation={{
                                nextEl: '.loop-button-top-selling-next',
                                prevEl: '.loop-button-top-selling-prev',
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
                            {[...Array(5)].map((_, index) => (
                                <SwiperSlide key={index} className="top-selling-column">
                                    <div className="swiper-object-image-container top-selling-image-container">
                                        <a href={clothes} data-fancybox="top-selling">
                                            <img
                                                src={clothes}
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </a>
                                    </div>
                                    <div className="top-selling-content">
                                        <h4 className="swiper-object-title top-selling-title">
                                            Футболка с деталями из ленты
                                        </h4>
                                        <bdi className="swiper-price top-selling-price">
                                            2,420,000 сум{" "}
                                            <span className="original-price">2,620,000 сум</span>
                                            <span className="discount">-20%</span>
                                        </bdi>
                                    </div>
                                </SwiperSlide>
                            ))}
                            <div className="swiper-buttons-together-right-container swiper-buttons-top-selling-container">
                                <div className="swiper-button-prev loop-button-top-selling-prev">
                                    <FontAwesomeIcon icon={faAngleLeft} />
                                </div>
                                <div className="swiper-button-next loop-button-top-selling-next">
                                    <FontAwesomeIcon icon={faAngleRight} />
                                </div>
                            </div>
                        </Swiper>
                    </InjectedUIFancybox>
                    <div className="view-all-clothes-link-container fade fadeInUp">
                        <a href="" className="view-all-clothes-link">
                            Просмотреть все
                        </a>
                    </div>
                </div>
            </section>
        )
    }
}

export default TopSelling;