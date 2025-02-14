import { PropsWithChildren, ReactNode } from "react";
import GlobalContextProvider from "./GlobalContext";
import ClothesContextProvider from "./ClothesContext";
import ClothesListProvider from "./ClothesListContext";
import UserContextProvider from "./UserContext";
import WishlistContextProvider from "./WishlistContext";
import CartContextProvider from "./CartContext";
import ProductModalProvider from "./ProductModal";

export interface ContextProvidersProps extends PropsWithChildren {}

const providers = [
    GlobalContextProvider,
    ClothesListProvider,
    ClothesContextProvider,
    UserContextProvider,
    WishlistContextProvider,
    CartContextProvider,
    ProductModalProvider,
];

function ContextProviders({ children }: ContextProvidersProps): ReactNode {
   return providers.reduce((acc, Provider) => <Provider>{acc}</Provider>, children);
}

export default ContextProviders;
