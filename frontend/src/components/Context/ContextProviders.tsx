import { PropsWithChildren, ReactNode } from "react";

export interface ContextProvidersProps extends PropsWithChildren {}

function ContextProviders(props: ContextProvidersProps): ReactNode {
  return props.children;
}

export default ContextProviders;
