import { PureComponent, ReactNode } from "react";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import star5 from "assets/main/images/main-page/5star.png";

class FeedbackSection extends PureComponent {
    render(): ReactNode {
        return (
            <section className="feedbacks-section">
                <div className="swiper-main-container feedbacks-container">
                    <div className="feedbacks-title-section">
                        <h2 className="swiper-subtitle feedbacks-subtitle fade fadeInDown">
                            Наши довольные клиенты
                        </h2>
                        <div className="swiper-buttons-together-right-container swiper-buttons-feedbacks-container fade fadeInUp">
                            <div className="swiper-button-prev loop-button-feedbacks-prev">
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </div>
                            <div className="swiper-button-next loop-button-feedbacks-next">
                                <FontAwesomeIcon icon={faArrowRight} />
                            </div>
                        </div>
                    </div>
                    <Swiper
                        className="mySwiper-feedbacks"
                        modules={[Navigation]}
                        navigation={{
                            nextEl: '.loop-button-feedbacks-next',
                            prevEl: '.loop-button-feedbacks-prev',
                        }}
                        slidesPerView={5}
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
                            480: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            800: {
                                slidesPerView: 3,
                                spaceBetween: 15,
                            },
                            1300: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                            2000: {
                                slidesPerView: 5,
                                spaceBetween: 25,
                            },
                        }}
                    >
                        {Array.from({ length: 6 }).map((_, index) => (
                            <SwiperSlide key={index} className="feedbacks-column">
                                <div className="feedbacks-content">
                                    <div className="feedback-rate-container">
                                        <img
                                            src={star5}
                                            alt="Rating"
                                        />
                                    </div>
                                    <h5 className="feedbacks-username">Sarah M.</h5>
                                    <p className="feedbacks-text">
                                        I'm blown away by the quality and style of the clothes I
                                        received from Shop.co. From casual wear to elegant dresses,
                                        every piece I've bought has exceeded my expectations.
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        )
    }
}

export default FeedbackSection;