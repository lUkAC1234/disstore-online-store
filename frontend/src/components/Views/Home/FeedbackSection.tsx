import { PureComponent, ReactNode } from "react";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import star5 from "assets/main/images/main-page/5star.png";
import styles from "./Home.module.scss";

class FeedbackSection extends PureComponent {
    render(): ReactNode {
        return (
            <section className={styles["feedbacks-section"]}>
                <div className={`${styles["feedbacks-main-container"]} ${styles["feedbacks-container"]}`}>
                    <div className={styles["feedbacks-title-section"]}>
                        <h2 className={styles["feedbacks-subtitle"]}>
                            Наши довольные клиенты
                        </h2>
                        <div className={`${styles["swiper-buttons-together-right-container"]} ${styles["swiper-buttons-feedbacks-container"]}`}>
                            <div className={styles["loop-button-feedbacks-prev"]}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </div>
                            <div className={styles["loop-button-feedbacks-next"]}>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </div>
                        </div>
                    </div>
                    <Swiper
                        className={styles["mySwiper-feedbacks"]}
                        modules={[Navigation]}
                        navigation={{
                            nextEl: `.${styles["loop-button-feedbacks-next"]}`,
                            prevEl: `.${styles["loop-button-feedbacks-prev"]}`,
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
                            <SwiperSlide key={index} className={styles["feedbacks-column"]}>
                                <div className={styles["feedbacks-content"]}>
                                    <div className={styles["feedback-rate-container"]}>
                                        <img
                                            src={star5}
                                            alt="Rating"
                                        />
                                    </div>
                                    <h5 className={styles["feedbacks-username"]}>Sarah M.</h5>
                                    <p className={styles["feedbacks-text"]}>
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
