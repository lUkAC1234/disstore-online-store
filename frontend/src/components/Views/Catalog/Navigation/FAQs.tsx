import { PureComponent, ReactNode } from "react";
import styles from "./Navigation.module.scss";

interface FAQsProps {
    
}

class FAQsSection extends PureComponent<FAQsProps> {
    render(): ReactNode {
        return (
            <section>
                <h1>FAQs Section</h1>
            </section>
        )
    }
}

export default FAQsSection;