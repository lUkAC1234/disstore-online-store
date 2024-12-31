import { Context, createContext } from "react";
import { GlobalContextStateWithActions } from "./GlobalContext";
import { ClothesContextActions } from "./ClothesContext";

export const GlobalContext: Context<GlobalContextStateWithActions> = createContext<GlobalContextStateWithActions>(null);
export const ClothesContext: Context<ClothesContextActions> = createContext<ClothesContextActions>(null);
