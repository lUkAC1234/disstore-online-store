import styles from "./BlockLoader.module.scss";
import { PureComponent, ReactNode, CSSProperties } from "react";

export interface BlockLoaderProps {
    isLoaded: boolean;
    loadingMessage?: any;
    children?: ReactNode;
    containerStyle?: CSSProperties;
    className?: string;
}

class BlockLoader extends PureComponent<BlockLoaderProps> {
    render() {
        const { isLoaded, loadingMessage, children, containerStyle, className } = this.props;
        if (!isLoaded) {
            return (
                <div style={containerStyle} className={className || styles.loadingBanner}>
                    {loadingMessage}
                    <div className={styles["loading-message-children-container"]}>
                        {this.props.children}
                    </div>
                </div>
            );
        }
        return <>{children}</>;
    }
}

export default BlockLoader;
