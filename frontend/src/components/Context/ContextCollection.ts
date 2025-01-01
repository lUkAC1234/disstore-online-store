import { Context, createContext } from "react";
import { GlobalContextStateWithActions } from "./GlobalContext";
import { ClothesContextActions } from "./ClothesContext";
import { ClothesListActions } from "./ClothesListContext";

export const GlobalContext: Context<GlobalContextStateWithActions> = createContext<GlobalContextStateWithActions>(null);
export const ClothesContext: Context<ClothesContextActions> = createContext<ClothesContextActions>(null);
export const ClothesListContext: Context<ClothesListActions> = createContext<ClothesListActions>(null);
