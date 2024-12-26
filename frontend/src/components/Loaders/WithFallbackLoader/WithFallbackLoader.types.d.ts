import { ReactNode } from "react";

declare global {
  interface WithFallbackLoaderProps {
    children: ReactNode;
    fallback?: ReactNode;
  }
}

export {}
