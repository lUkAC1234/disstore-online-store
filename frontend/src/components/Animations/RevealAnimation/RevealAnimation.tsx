import { createRef, PureComponent, ReactNode, RefObject } from "react";
import styles from "./RevealAnimation.module.scss";

class RevealAnimation extends PureComponent<RevealAnimationProps, RevealAnimationState> {
  observer: IntersectionObserver;
  containerRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();

  state: Readonly<RevealAnimationState> = {
    isIntersecting: false,
  };

  get computedClassName(): string {
    return this.state.isIntersecting
      ? `${styles["container"]} ${styles["container--reveal"]}`
      : styles["container"];
  }

  render(): ReactNode {
    return (
      <div className={this.computedClassName} ref={this.containerRef}>
        {this.props.children}
      </div>
    );
  }

  componentDidMount(): void {
    this.observer = new IntersectionObserver(this.observerCallback, this.props.observerInit);
    this.observer.observe(this.containerRef.current);
  }

  componentWillUnmount(): void {
    this.observer.disconnect();
    this.observer = null;
  }

  observerCallback = (entries: IntersectionObserverEntry[]): void => {
    let isIntersecting: boolean;

    this.setState(prevState => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isIntersecting = true;
        } else {
          isIntersecting = false;
        }
      });

      return { ...prevState, isIntersecting };
    }, () => {
      if (this.props.logSnapshot) {
        console.log({
          isIntersecting,
          container: this.containerRef.current,
        });
      }
    });
  }
}

export default RevealAnimation;
