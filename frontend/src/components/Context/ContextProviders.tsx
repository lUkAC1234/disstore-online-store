import { PropsWithChildren, ReactNode } from "react";
import GlobalContextProvider from "./GlobalContext";
import ClothesContextProvider from "./ClothesContext";
import ClothesListProvider from "./ClothesListContext";

export interface ContextProvidersProps extends PropsWithChildren {}

function ContextProviders(props: ContextProvidersProps): ReactNode {
  return (
    <GlobalContextProvider>
      <ClothesListProvider>
        <ClothesContextProvider>
          {props.children}
        </ClothesContextProvider>
      </ClothesListProvider>
    </GlobalContextProvider>
  );
}

export default ContextProviders;
