import { createRef, PureComponent, ReactNode, RefObject } from "react";
import { DEFAULT_OPTIONS, SCALE_ANIMATION_FRAMES } from "./AnimationScale.constants";
import { animateComponent } from "./AnimationScale.utils";
import styles from "./AnimationScale.module.scss";

class AnimationScale extends PureComponent<AnimationScaleProps, AnimationScaleState> {
  state: Readonly<AnimationScaleState> = {
    keyframes: SCALE_ANIMATION_FRAMES,
    defaultOptions: DEFAULT_OPTIONS,
  };

  containerRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();

  render(): ReactNode {
    return (
      <div className={styles["scale-animation"]} ref={this.containerRef}>
        {this.props.children}
      </div>
    );
  }

  componentDidMount(): void {
    this.animate();
  }

  componentDidUpdate(prevProps: Readonly<AnimationScaleProps>): void {
    if (prevProps.animate !== this.props.animate) {
      this.animate();
    }
  }

  animate(): void {
    animateComponent(this);
  }
}

export default AnimationScale;
