import Transition from "./Transition";
import { TRANSITION_ERRORS } from "./Transition.constants";

export function animateComponent(context: Transition): void {
  try {
    if (!context.containerRef) {
      throw new TypeError(TRANSITION_ERRORS.containerRef);
    }

    context.containerRef?.current?.animate(
      context.state.keyframes,
      context.props.options ?? context.state.defaultOptions,
    );
  } catch (err) {
    console.trace(err);
  }
}
