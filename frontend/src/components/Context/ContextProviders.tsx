import { PropsWithChildren, ReactNode } from "react";
import GlobalContextProvider from "./GlobalContext";
import ClothesContextProvider from "./ClothesContext";
import ClothesListProvider from "./ClothesListContext";
import UserContextProvider from "./UserContext";

export interface ContextProvidersProps extends PropsWithChildren {}

const providers = [
    GlobalContextProvider,
    ClothesListProvider,
    ClothesContextProvider,
    UserContextProvider,
];

function ContextProviders({ children }: ContextProvidersProps): ReactNode {
   return providers.reduce((acc, Provider) => <Provider>{acc}</Provider>, children);
}

export default ContextProviders;
