import styles from "./FAQ.module.scss";
import NavigationError from "../../NavigationError/NavigationError";
import { PureComponent, ReactNode } from "react";

interface FAQsProps {
    faqs?: any[];
}

class FAQsSection extends PureComponent<FAQsProps> {
    render(): ReactNode {
        return (
            <section className={styles["faq-section"]}>
                <div className={styles["faq-container"]}>
                    <h1>FAQs Section</h1>
                    {this.props.faqs && this.props.faqs.length > 0 ? (
                        this.props.faqs.map((faqs, index) => (
                            <div key={index}>
                                <h4>{faqs.question}</h4>
                                <p>{faqs.answer}</p>
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