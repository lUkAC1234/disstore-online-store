import { WithTranslation } from "react-i18next";

declare global {
  interface RouteItem {
    path: string;
    element: ReactNode;
    index?: boolean;
  }

  interface RouterViewProps extends WithTranslation {}

  interface RouterViewState {
    pathname: string;
    routesMap: Map<string, RouteItem>;
  }

  interface SetDocumentTitleOptions {
    path?: string;
    splittedIndex?: number;
    currentLng?: string;
    title_ru: string;
    title_oz: string;
    title_uz: string;
  }
}

export {}
