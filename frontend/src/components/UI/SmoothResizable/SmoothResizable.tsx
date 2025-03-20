import styles from "./SmoothResizable.module.scss";
import { createRef, PureComponent, RefObject } from "react";
import { COMPONENT } from "decorators/Component";
import { debounce } from "utils/hooks/debounce";
import setCssVariable from "utils/hooks/setCssVariable";

@COMPONENT<SmoothResizable>({
  template: (_this) => {
    return (
      <div
        className={styles["main"]}
        ref={_this.mainRef}
      >
        <div
          className={styles["wrapper"]}
          ref={_this.wrapperRef}
        >
          {_this.props.children}
        </div>
      </div>
    );
  }
})
class SmoothResizable extends PureComponent<SmoothResizableProps> {
  mainRef: RefObject<HTMLDivElement> = createRef();
  wrapperRef: RefObject<HTMLDivElement> = createRef();
  resizeObserver: ResizeObserver;

  componentDidMount(): void {
    this.setupResizeObserver();

    if (this.props.transitionDurationMS) {
      setCssVariable("--smooth-resizable-height-transition", `${this.props.transitionDurationMS}ms`);
    }
  }

  componentWillUnmount(): void {
    this.destroyResizeObserver();
  }

  componentDidUpdate(prevProps: Readonly<SmoothResizableProps>): void {
    if (prevProps.children !== this.props.children) {
      this.resizeObserverCallback();
    }
  }

  setupResizeObserver = debounce(() => {
    this.resizeObserver = new ResizeObserver(this.resizeObserverCallback);
    if (this.wrapperRef.current instanceof Element) {
      this.resizeObserver.observe(this.wrapperRef.current);
    }
  }, 50);

  destroyResizeObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  resizeObserverCallback = (): void => {
    const maxHeight: string = `${this.wrapperRef.current?.offsetHeight}px`;
    this.mainRef.current.style.height = maxHeight;
  }
}

export default SmoothResizable;
