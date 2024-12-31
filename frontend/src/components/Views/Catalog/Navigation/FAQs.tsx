import { PureComponent, ReactNode } from "react";
import styles from "./Navigation.module.scss";

interface FAQsProps {
    
}

class FAQsSection extends PureComponent<FAQsProps> {
    render(): ReactNode {
        return (
            <section className={styles["faq-section"]}>
                <div className={styles["faq-container"]}>
                    <h1>FAQs Section</h1>
                </div>
            </section>
        )
    }
}

export default FAQsSection;