export const SCALE_ANIMATION_FRAMES: Keyframe[] | PropertyIndexedKeyframes = [
  { transform: "scale(0)" },
  { transform: "scale(1)" },
];

export const DEFAULT_OPTIONS: number | KeyframeAnimationOptions = {
  easing: "ease",
  duration: 300,
};

export const SCALE_ANIMATION_ERRORS = {
  containerRef: "Property containerRef is undefined, it is either doesn't exist, or something went wrong in callstack or somewhere else",
};
