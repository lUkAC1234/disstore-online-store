import { PropsWithChildren, ReactNode } from "react";
// import { GlobalContext } from "./ContextCollection";
import GlobalContextProvider from "./GlobalContext";

export interface ContextProvidersProps extends PropsWithChildren {}

function ContextProviders(props: ContextProvidersProps): ReactNode {
  return (
    <GlobalContextProvider>
      {props.children}
    </GlobalContextProvider>
  )
}

export default ContextProviders;
