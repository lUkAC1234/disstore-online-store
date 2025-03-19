import { CSSProperties, PureComponent, ReactNode, createRef } from "react";
import BlockLoader, { BlockLoaderProps } from "components/BlockLoaders/BlockLoader";
import styles from "./OptimizedImage.module.scss";

export interface OptimizedImageProps extends Omit<BlockLoaderProps, "isLoaded"> {
  src: string;                          // URL of the main image
  alt: string;                          // Alternative text for accessibility
  thumbnail?: string;                   // Thumbnail URL to show while the main image loads
  fallbackSrc?: string;                 // Fallback image if the main image fails to load
  imageClassname?: string;              // Additional CSS class for the main image element

  aspect_16_9?: boolean;                // if true adds class aspect_16_9
  no_aspect?: boolean;                  // if true adds class no_aspect
  no_image_height?: boolean;            // if true adds class no_image_height
  imagePropsStyle?: CSSProperties        // Styles for an image
}

export interface OptimizedImageState {
  isLoaded: boolean;                    // True when the main image has finished loading (or errored)
  isInView: boolean;                    // True when the component is in the viewport
  isError: boolean;                     // True if the main image fails to load
}

class OptimizedImage extends PureComponent<OptimizedImageProps, OptimizedImageState> {
  containerRef = createRef<HTMLDivElement>();
  observer: IntersectionObserver | null = null;

  state: OptimizedImageState = {
    isLoaded: false,
    isInView: false,
    isError: false,
  };

  componentDidMount() {
    if (this.containerRef.current) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.setState({ isInView: true });
            if (this.observer) {
              this.observer.disconnect();
            }
          }
        });
      });
      this.observer.observe(this.containerRef.current);
    }
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  handleImageLoad = () => {
    this.setState({ isLoaded: true });
  };

  handleImageError = () => {
    this.setState({ isError: true, isLoaded: true });
  };

  render(): ReactNode {
    const {
      src,
      alt,
      thumbnail,
      fallbackSrc,
      containerStyle,
      className,
      imageClassname,
      loadingMessage,
      no_image_height,
      aspect_16_9,
      no_aspect,
      imagePropsStyle
    } = this.props;
    const { isLoaded, isError } = this.state;

    const effectiveSrc = isError && fallbackSrc ? fallbackSrc : src;
    const wrapperStyle = {
      ...containerStyle,
      ...(thumbnail && !isLoaded
        ? {
          backgroundImage: `url(${thumbnail})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
        : {}),
    };

    const containerClassNames = [
      styles.imageWrapper,
      no_image_height ? styles.no_image_height : "",
      aspect_16_9 ? styles.aspect_16_9 : "",
      no_aspect ? styles.no_aspect : "",
      className || "",
    ]
      .filter(Boolean) 
      .join(" ");

    return (
      <div ref={this.containerRef} style={wrapperStyle} className={containerClassNames}>
        <BlockLoader isLoaded={!!effectiveSrc} loadingMessage={loadingMessage || ""}>
          <img
            src={effectiveSrc}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={this.handleImageLoad}
            onError={this.handleImageError}
            className={`${imageClassname || ""} ${styles.mainImage}`}
            style={{
              opacity: isLoaded ? 1 : 0,
              ...imagePropsStyle
            }}
          />
        </BlockLoader>
      </div>
    );
  }
}

export default OptimizedImage;
