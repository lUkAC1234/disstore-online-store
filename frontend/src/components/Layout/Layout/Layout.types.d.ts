import { GlobalContextStateWithActions } from "components/Context/GlobalContext";
import { InternetStateContextStateWithActions } from "components/Context/InternetStateContext";

declare global {
  interface LayoutProps extends GlobalContextStateWithActions, InternetStateContextStateWithActions {}
}

export {}
