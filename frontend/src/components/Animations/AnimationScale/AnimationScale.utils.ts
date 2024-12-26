import AnimationScale from "./AnimationScale";
import { SCALE_ANIMATION_ERRORS } from "./AnimationScale.constants";

function animateComponent(context: AnimationScale): void {
  try {
    if (!context.containerRef) {
      throw new TypeError(SCALE_ANIMATION_ERRORS.containerRef);
    }

    context.containerRef?.current?.animate(
      context.state.keyframes,
      context.props.options ?? context.state.defaultOptions,
    );
  } catch (err) {
    console.trace(err);
  }
}

export {
  animateComponent,
};
