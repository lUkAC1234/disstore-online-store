import styles from "./Review.module.scss";
import NavigationError from "../../NavigationError/NavigationError";
import { PureComponent, ReactNode } from "react";
import DateComputed from "components/DateComputed/DateComputed";
import ReviewItem from "./ReviewItem/ReviewItem";

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
                                    <ReviewItem
                                        key={index}
                                        userEmail={review.user.email}
                                        text={review.text}
                                        createdAt={review.created_at}
                                    />
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