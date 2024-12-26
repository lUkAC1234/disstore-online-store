declare global {
  interface RevealAnimationProps {
    children: ReactNode;
    observerInit?: IntersectionObserverInit;
    logSnapshot?: boolean;
  }

  interface RevealAnimationState {
    isIntersecting: boolean;
  }
}

export {}
