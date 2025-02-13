import { Context, createContext } from "react";
import { GlobalContextStateWithActions } from "./GlobalContext";
import { ClothesContextActions } from "./ClothesContext";
import { ClothesListActions } from "./ClothesListContext";
import { UserContextActions } from "./UserContext";
import { WishlistContextActions } from "./WishlistContext";
import { CartContextActions } from "./CartContext";

export const GlobalContext: Context<GlobalContextStateWithActions> = createContext<GlobalContextStateWithActions>(null);
export const ClothesContext: Context<ClothesContextActions> = createContext<ClothesContextActions>(null);
export const ClothesListContext: Context<ClothesListActions> = createContext<ClothesListActions>(null);
export const UserContext: Context<UserContextActions> = createContext<UserContextActions>(null);
export const WishlistContext: Context<WishlistContextActions> = createContext<WishlistContextActions>(null);
export const CartContext: Context<CartContextActions> = createContext<CartContextActions>(null);
