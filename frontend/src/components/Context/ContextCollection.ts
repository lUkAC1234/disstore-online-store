import { Context, createContext } from "react";
import { ComplainContextStateWithActions } from "./ComplainContext";
import { ContactUsContextStateWithActions } from "./ContactUsContext";
import { FontSizeContextStateWithActions } from "./FontSizeContext";
import { FooterContextStateWithActions } from "./FooterContext";
import { GlobalContextStateWithActions } from "./GlobalContext";
import { InternetStateContextStateWithActions } from "./InternetStateContext";
import { MapContextStateWithActions } from "./MapContext";
import { PlantTreesContextStateWithActions } from "./PlantTreesContext";
import { ThemeContextStateWithActions } from "./ThemeContext";
import { LoadingTreeContextStateWithActions } from "./LoadingTreeContext";

export const FontSizeContextState = {
  fontSize: 0,
  min: 0,
  max: 8,
  step: 0.01,
};

export const ComplainContext: Context<ComplainContextStateWithActions> = createContext<ComplainContextStateWithActions>(null);
export const ContactUsContext: Context<ContactUsContextStateWithActions> = createContext<ContactUsContextStateWithActions>(null);
export const FetchContext: Context<FetchContextState> = createContext<FetchContextState>(null);
export const FontSizeContext: Context<FontSizeContextStateWithActions> = createContext<FontSizeContextStateWithActions>({
  ...FontSizeContextState,
  setFontSize: null,
});
export const FooterContext: Context<FooterContextStateWithActions> = createContext<FooterContextStateWithActions>(null);
export const GlobalContext: Context<GlobalContextStateWithActions> = createContext<GlobalContextStateWithActions>(null);
export const InternetStateContext: Context<InternetStateContextStateWithActions> = createContext<InternetStateContextStateWithActions>(null);
export const MapContext: Context<MapContextStateWithActions> = createContext<MapContextStateWithActions>(null);
export const PlantTreesContext: Context<PlantTreesContextStateWithActions> = createContext<PlantTreesContextStateWithActions>(null);
export const ThemeContext: Context<ThemeContextStateWithActions> = createContext<ThemeContextStateWithActions>(null);
export const LoadingTreeContext: Context<LoadingTreeContextStateWithActions> = createContext<LoadingTreeContextStateWithActions>(null);
