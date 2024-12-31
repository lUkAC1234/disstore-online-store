import { PropsWithChildren, ReactNode } from "react";
import GlobalContextProvider from "./GlobalContext";
import ClothesContextProvider from "./ClothesContext";

export interface ContextProvidersProps extends PropsWithChildren {}

function ContextProviders(props: ContextProvidersProps): ReactNode {
  return (
    <GlobalContextProvider>
      <ClothesContextProvider>
        {props.children}
      </ClothesContextProvider>
    </GlobalContextProvider>
  )
}

export default ContextProviders;
