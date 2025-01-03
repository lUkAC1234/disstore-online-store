import { PureComponent, ReactNode } from "react";
import styles from "./Navigation.module.scss";

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
                    <h1>Review Section</h1>
                    {this.props.reviews && this.props.reviews.length > 0 ? (
                        this.props.reviews.map((review, index) => (
                            <div key={index}>
                                <h4>{review.user.username}</h4>
                                <p>{review.text}</p>
                            </div>
                        ))
                    ) : (
                        <p>Пока что нету отзывов</p>
                    )}
                </div>
            </section>
        )
    }
}

export default ReviewSection;