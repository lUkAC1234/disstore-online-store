import styles from "./CloseMessage.module.scss";
import { PureComponent, ReactNode } from "react";

interface CloseMessageProps {
    closingFunction: () => void;
}

class CloseMessage extends PureComponent<CloseMessageProps> {
    render(): ReactNode {
        return <button className={styles["success-cart-close-button"]} onClick={this.props.closingFunction}>
            <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.28 7.22a.75.75 0 0 0-1.06 1.06L10.94 12l-3.72 3.72a.75.75 0 0 0 1.06 1.06L12 13.06l3.72 3.72a.75.75 0 0 0 1.06-1.06L13.06 12l3.72-3.72a.75.75 0 1 0-1.06-1.06L12 10.94 8.28 7.22Z"
                    fill="#4E5155"
                />
            </svg>
        </button>;
    }
}

export default CloseMessage;