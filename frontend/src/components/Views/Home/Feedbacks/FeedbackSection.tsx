import styles from "./Feedback.module.scss";
import { PureComponent, ReactNode } from "react";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { origin } from "../../../../../project.config.json";
import { Container, HeadingTwo, Section } from "components/UI/Html/Elements/Elements";
import ReviewItem from "components/Views/Catalog/CatalogDetails/Navigation/Review/ReviewItem/ReviewItem";

class FeedbackSection extends PureComponent<FeedbackProps, FeedbackState> {
    state: Readonly<FeedbackState> = {
        feedbacks: [],
        error: "",
    }
    componentDidMount() {
        const cachedFeedbacks = sessionStorage.getItem("feedbacks");
        if (cachedFeedbacks) {
            this.setState({ feedbacks: JSON.parse(cachedFeedbacks) });
        } else {
            this.fetchData();
        }
    }

    async fetchData(): Promise<void> {
        try {
            const response: Response = await fetch(`${origin}/global/reviews`);
            if (!response.ok) {
                throw new Error("Не получилось получить данные");
            }

            const feedbacks: FeedbackData[] = await response.json();
            this.setState({ feedbacks }, () => {
                sessionStorage.setItem("feedbacks", JSON.stringify(feedbacks));
            });
        } catch (err) {
            this.setState({ error: err.message });
            console.error(err);
        }
    }
    render(): ReactNode {
        const { feedbacks } = this.state;
        return (
            <Section className={styles["feedbacks-section"]}>
                <Container className={`${styles["feedbacks-main-container"]} ${styles["feedbacks-container"]}`}>
                    <div className={styles["feedbacks-title-section"]}>
                        <HeadingTwo bold className={styles["feedbacks-subtitle"]}>
                            Наши довольные клиенты
                        </HeadingTwo>
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
                                slidesPerView: 1.5,
                                spaceBetween: 10,
                            },
                            800: {
                                slidesPerView: 2,
                                spaceBetween: 15,
                            },
                            1300: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            2000: {
                                slidesPerView: 4,
                                spaceBetween: 25,
                            },
                        }}
                    >
                        {feedbacks && feedbacks.length > 0 ? (
                            feedbacks.map((feedback) => (
                                <SwiperSlide key={feedback.id} className={styles["feedbacks-column"]}>
                                    <ReviewItem
                                        userEmail={feedback.user.email}
                                        text={feedback.text}
                                        createdAt={feedback.created_at}
                                    />
                                </SwiperSlide>
                            ))
                        ) : (
                            <div>Пока нету отзывов</div>
                        )}
                    </Swiper>
                </Container>
            </Section>
        )
    }
}

export default FeedbackSection;
