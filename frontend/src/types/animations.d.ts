import { ReactNode } from "react";

declare global {
  interface AnimationProps {
    children: ReactNode;
    options?: number | KeyframeAnimationOptions;
    animate: boolean;
  }

  interface AnimationState {
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null;
    defaultOptions: number | KeyframeAnimationOptions;
  }
}

export {}
