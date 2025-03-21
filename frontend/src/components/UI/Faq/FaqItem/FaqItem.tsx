import { PureComponent, ReactNode } from "react";
import styles from "./FaqItem.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

class FaqItem extends PureComponent<FaqItemProps, FaqItemState> {
    state: Readonly<FaqItemState> = {
        isActive: false
    };

    toggleAnswer = (): void => {
        this.setState((prevState) => ({ isActive: !prevState.isActive }));
    };

    render(): ReactNode {
        const { question, answer } = this.props;
        const { isActive } = this.state;
        return (
            <div className={styles["faq-item"]}>
                <div className={styles["faq-item-head"]}>
                    <button className={isActive
                        ? `${styles["faq-toggler"]} ${styles["faq-toggler--active"]}`
                        : styles["faq-toggler"]} onClick={this.toggleAnswer}>
                        <h3 className={styles["faq-question"]}>{question}</h3>
                        <FontAwesomeIcon className={styles["faq-icon"]} icon={faChevronDown} />
                    </button>
                </div>
                <div
                    className={`${styles["faq-answer-container"]} ${isActive ? styles["active"] : ""}`}
                >
                    <div
                        className={styles["faq-answer"]}
                        dangerouslySetInnerHTML={{ __html: answer }}
                    />
                </div>
            </div >
        );
    }
}

export default FaqItem