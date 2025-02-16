import styles from "./BlockLoader.module.scss";
import { PureComponent, ReactNode, CSSProperties } from "react";

export interface BlockLoaderProps {
    isLoaded: boolean;
    loadingMessage?: string;
    children?: ReactNode;
    containerStyle?: CSSProperties;
}

class BlockLoader extends PureComponent<BlockLoaderProps> {
    render() {
        const { isLoaded, loadingMessage, children, containerStyle } = this.props;
        if (!isLoaded) {
            return (
                <div style={containerStyle} className={styles.loadingBanner}>
                    {loadingMessage}
                </div>
            );
        }
        return <>{children}</>;
    }
}

export default BlockLoader;
