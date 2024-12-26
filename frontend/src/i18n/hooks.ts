import { ComponentType } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { supportedLanguages } from "./constants";

export const getWithTranslation = <P extends WithTranslation>(
  Component: ComponentType<P>
): ComponentType<Omit<P, keyof WithTranslation>> => {
  return withTranslation()(Component) as ComponentType<Omit<P, keyof WithTranslation>>;
}

export const onLanguageChanged = (lng: string): void => {
  const pathname: string = location.pathname;
  const splitted: string[] = pathname.split("/");
  let finalPathname: string = "";
  let newPathname: string = "";
  let includes: boolean = false;

  supportedLanguages.forEach((supported: string) => {
    if (pathname.includes(supported)) {
      includes = true;
      return;
    }
  });

  if (!includes) {
    return;
  }

  splitted.forEach((path: string, index: number) => {
    if (index > 1) {
      finalPathname += "/" + path;
    }
  });

  newPathname = `/${lng}${finalPathname}`;
  if (location.pathname !== newPathname) {
    history.pushState(null, "", newPathname);
    document.documentElement.lang = lng;
  }
}

export const getLanguageFromPath = (): string => {
  const lang: string = location.pathname.split("/")[1];
  const supported: boolean = supportedLanguages.includes(lang);
  return supported ? lang : "";
}
