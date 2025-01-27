import styles from "./FAQ.module.scss";
import NavigationError from "../../NavigationError/NavigationError";
import { PureComponent, ReactNode } from "react";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FAQsProps {
    faqs?: any[];
}

interface FAQsState {
    activeIndices: number[];
}

class FAQsSection extends PureComponent<FAQsProps, FAQsState> {
    state: Readonly<FAQsState> = {
        activeIndices: [0, 1, 2],
    };


    toggleFAQ = (index: number) => {
        this.setState((prevState) => {
            const isActive = prevState.activeIndices.includes(index);
            return {
                activeIndices: isActive
                    ? prevState.activeIndices.filter((i) => i !== index)
                    : [...prevState.activeIndices, index],
            };
        });
    };

    render(): ReactNode {
        return (
            <section className={styles["faq-section"]}>
                <div className={styles["faq-container"]}>
                    <h3 className={styles["faq-subtitle"]}>
                        Часто Задаваемые Вопросы
                        {this.props.faqs && this.props.faqs.length > 0 ? (
                            <span className={styles["faq-count"]}>({this.props.faqs.length})</span>
                        ) : (null)}
                    </h3>
                    {this.props.faqs && this.props.faqs.length > 0 ? (
                        this.props.faqs.map((faqs, index) => (
                            <div className={styles["faq-content-container"]} key={index}>
                                <button
                                    className={styles["faq-toggle-button"]}
                                    onClick={() => this.toggleFAQ(index)}
                                >
                                    <h4 className={styles["faq-question"]}>{faqs.question}</h4>
                                    <FontAwesomeIcon icon={faAngleRight} />
                                </button>
                                <div
                                    className={`${styles["faq-answer-wrapper"]} ${this.state.activeIndices.includes(index)
                                        ? styles["active"]
                                        : ""
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: String(faqs.answer) }}
                                />
                            </div>
                        ))
                    ) : (
                        <NavigationError error={"Пока что нету вопросов"} />
                    )}
                </div>
            </section>
        )
    }
}

export default FAQsSection;