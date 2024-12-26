import { PureComponent, ReactNode, RefObject, createRef } from "react";
import styles from "./Transition.module.scss";
import { TRANSITION_ANIMATION_FRAMES, TRANSITION_ANIMATION_OPTIONS } from "./Transition.constants";
import { animateComponent } from "./Transition.utils";

class Transition extends PureComponent<TransitionProps, TransitionState> {
  state: Readonly<TransitionState> = {
    keyframes: TRANSITION_ANIMATION_FRAMES,
    defaultOptions: TRANSITION_ANIMATION_OPTIONS,
  };

  containerRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();

  render(): ReactNode {
    return (
      <div className={styles["transition"]} ref={this.containerRef}>
        {this.props.children}
      </div>
    );
  }

  componentDidMount(): void {
    this.animate();
  }

  componentDidUpdate(prevProps: Readonly<TransitionProps>): void {
    if (prevProps.animate !== this.props.animate) {
      this.animate();
    }
  }

  animate(): void {
    animateComponent(this);
  }
}

export default Transition;
