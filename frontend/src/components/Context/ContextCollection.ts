import { Context, createContext } from "react";
import { GlobalContextStateWithActions } from "./GlobalContext";

export const GlobalContext: Context<GlobalContextStateWithActions> = createContext<GlobalContextStateWithActions>(null);
