# AnimationScale component

So, this component simply wrapper for scaling animation, all it does is simple, you got component as wrapper for your children and compulsory animate prop that takes boolean value, if true, animation starts, else stops, or never plays.

Here is sketch layout of source:

```tsx
import { createRef, PureComponent, ReactNode, RefObject } from "react";
import { DEFAULT_OPTIONS, SCALE_ANIMATION_FRAMES } from "./AnimationScale.constants";
import { animateComponent } from "./AnimationScale.utils";
import styles from "./AnimationScale.module.scss";

class AnimationScale extends PureComponent<AnimationScaleProps, AnimationScaleState> {
  state: Readonly<AnimationState> = {
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

  componentDidUpdate(prevProps: Readonly<AnimationProps>): void {
    if (prevProps.animate !== this.props.animate) {
      this.animate();
    }
  }

  animate(): void {
    animateComponent(this);
  }
}

export default AnimationScale;
```
