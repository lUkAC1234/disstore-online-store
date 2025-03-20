import { PropsWithChildren } from "react";

declare global {
  interface SmoothResizableProps extends PropsWithChildren {
    transitionDurationMS?: number;
  }
}

export {}
