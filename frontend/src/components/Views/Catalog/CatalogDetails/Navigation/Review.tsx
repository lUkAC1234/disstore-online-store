import { PureComponent, ReactNode } from "react";
import styles from "./Navigation.module.scss";

interface ReviewProps {

}

interface ReviewState {

}

class ReviewSection extends PureComponent<ReviewProps, ReviewState> {
    render(): ReactNode {
        return (
            <section className={styles["review-section"]}>
                <div className={styles["review-container"]}>
                    <h1>Review Section</h1>
                </div>
            </section>
        )
    }
}

export default ReviewSection;