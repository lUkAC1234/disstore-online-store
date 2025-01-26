import styles from "./Review.module.scss";
import NavigationError from "../../NavigationError/NavigationError";
import { PureComponent, ReactNode } from "react";
import DateComputed from "components/DateComputed/DateComputed";

interface ReviewProps {
    reviews?: any[];
}

interface ReviewState {

}

class ReviewSection extends PureComponent<ReviewProps, ReviewState> {
    render(): ReactNode {
        return (
            <section className={styles["review-section"]}>
                <div className={styles["review-container"]}>
                    <h3 className={styles["review-main-title"]}>
                        Все отзывы
                        {this.props.reviews && this.props.reviews.length > 0 ? (
                            <span className={styles["review-main-title-count"]}>({this.props.reviews.length})</span>
                        ) : (null)}
                    </h3>
                    <div className={styles["reviews-items-wrapper"]}>
                        {this.props.reviews && this.props.reviews.length > 0 ? (
                            this.props.reviews.map((review, index) => (
                                review.is_allowed ? (
                                    <div className={styles["review-item"]} key={index}>
                                        <h4 className={styles["review-item-title"]}>
                                            {review.user.username}
                                            <svg aria-label="Подтвержденный" fill="#01AB31" height="1rem" width="1rem" role="img" viewBox="0 0 40 40"><title>Подтвержденный</title><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path></svg>
                                        </h4>
                                        <p className={styles["review-item-text"]}>
                                            {review.text.length > 150 ? `${review.text.slice(0, 150)}...` : review.text}
                                        </p>
                                        <div className={styles["review-date-container"]}>
                                            <span className={styles["review-date-name"]}>Опубликовано</span>
                                            <DateComputed
                                                date={new Date(review.created_at)} order={"day/month/year"}
                                                orderStyle="."
                                                className={styles["review-date"]}
                                            />
                                        </div>
                                    </div>
                                ) : null

                            ))
                        ) : (
                            <NavigationError error={"Пока что нету отзывов"} />
                        )}
                    </div>
                </div>
            </section>
        )
    }
}

export default ReviewSection;