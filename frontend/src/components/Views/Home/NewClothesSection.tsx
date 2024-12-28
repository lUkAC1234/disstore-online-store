import { PureComponent, ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import clothes from "assets/main/images/layout/clothes.jpg";
import InjectedUIFancybox from "components/Fancybox/Fancybox";

class NewClothes extends PureComponent {
    render(): ReactNode {
        return (
            <section className="swiper-section new-clothes-section">
                <div className="swiper-main-container new-clothes-container">
                    <h2 className="swiper-subtitle new-clothes-subtitle fade fadeInDown">
                        Новинки
                    </h2>
                    <InjectedUIFancybox>
                        <Swiper
                            className="mySwiper-new-clothes"
                            modules={[Navigation]}
                            navigation={{
                                nextEl: '.loop-button-new-clothes-next',
                                prevEl: '.loop-button-new-clothes-prev',
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
                                    <SwiperSlide key={index} className="new-clothes-column">
                                        <div className="swiper-object-image-container new-clothes-image-container">
                                            <a href={imageUrl} data-fancybox="gallery" data-caption={`Image ${index + 1}`}>
                                                <img
                                                    src={imageUrl}
                                                    alt={`Clothes ${index + 1}`}
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            </a>
                                        </div>
                                        <div className="new-clothes-content">
                                            <h4 className="swiper-object-title new-clothes-title">
                                                Футболка с деталями из
                                            </h4>
                                            <bdi className="swiper-price new-clothes-price">
                                                23,420,000 сум{" "}
                                                <span className="original-price">25,620,000 сум</span>
                                                <span className="discount">-20%</span>
                                            </bdi>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
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

export default NewClothes;
