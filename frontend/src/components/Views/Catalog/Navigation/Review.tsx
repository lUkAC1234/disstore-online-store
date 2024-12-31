import { PureComponent, ReactNode } from "react";
import styles from "./Navigation.module.scss";

interface ReviewProps {

}

interface ReviewState {

}

class ReviewSection extends PureComponent<ReviewProps, ReviewState> {
    render(): ReactNode {
        return (
            <section>
                <h1>Review Section</h1>
            </section>
        )
    }
}

export default ReviewSection;