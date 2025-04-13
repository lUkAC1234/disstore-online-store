import i18next from "i18next";
import { ComponentType } from "react";
import { WithTranslation, withTranslation as i18nWithTranslation } from "react-i18next";
import { defaultLng, supportedLanguages } from "./constants";

const languages: string[] = [];
const langList: string[] = supportedLanguages.toSorted((a, b) => Number(a) - Number(b));
let hasAllResources: boolean = false;

const withTranslation = <P extends WithTranslation>(
  Component: ComponentType<P>
): ComponentType<Omit<P, keyof WithTranslation>> => {
  const WithTranslationComponent = i18nWithTranslation()(Component) as ComponentType<Omit<P, keyof WithTranslation>>;
  WithTranslationComponent.displayName = "WithTranslation";
  return WithTranslationComponent;
};

function indexOfLangPath(): number {
  const splittedPathList: string[] = location.pathname.split("/");
  const indexOfLangPath: number = splittedPathList.findIndex(lng => supportedLanguages.includes(lng));
  return indexOfLangPath;
}

const onLanguageChanged = (lng: string): void => {
  const pathname: string = location.pathname;
  const splitted: string[] = pathname.split("/");
  const langPathIndex: number = indexOfLangPath();
  let finalPathname: string = "";
  let newPathname: string = "";
  let includes: boolean = false;

  for (let i = 0; i < supportedLanguages.length; ++i) {
    const supported: string = supportedLanguages[i];
    if (pathname.includes(supported)) {
      includes = true;
      break;
    }
  }

  for (let i = 0; i < splitted.length; ++i) {
    const path: string = splitted[i];
    if (i > langPathIndex && path) {
      finalPathname += "/" + path;
    }
  }

  newPathname = `/${includes ? lng : defaultLng}${finalPathname}`;

  if (location.pathname !== newPathname) {
    history.pushState(null, "", newPathname);
    document.documentElement.lang = lng;
  }
};

const getLanguageFromPath = (): string => {
  const splittedPathList: string[] = location.pathname.split("/");
  const index: number = indexOfLangPath();
  const lang: string = splittedPathList[index];
  return (index === -1) ? defaultLng : lang;
};

const popstateListener = (): void => {
  const lang = getLanguageFromPath();
  if (lang === i18next.language) return;
  i18next.changeLanguage(lang);
};

async function fetchLocales(lang: string): Promise<void> {
  try {
    const locale = await import(`i18n/resources/${lang}.json`);
    i18next.addResourceBundle(lang, "translation", locale, true, true);
  } catch (err) {
    console.error(err);
  }
}

const loadLocale = async (lang: string): Promise<void> => {
  try {
    for (let i = 0; i < languages.length; ++i) {
      if (languages[i] !== lang) {
        languages.push(lang);
      }
    }

    if (!i18next.hasResourceBundle(lang, "translation")) {
      await fetchLocales(lang);
      return;
    }

    if (languages.length >= 3) {
      const sortedLanguages = languages.toSorted((a, b) => +a - +b);

      for (let i = 0; i < sortedLanguages.length; ++i) {
        const langItem: string = sortedLanguages[i];
        for (let j = 0 ; j < langList.length; ++j) {
          const suppLangItem: string = langList[j];
          if (langItem === suppLangItem) {
            hasAllResources = true;
          }
        }
      }

      if (hasAllResources) {
        i18next.off("languageChanged", loadLocale);
        return;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const onAddedLanguageHandler = (lng?: string): void => {
  i18next.changeLanguage(lng);
};

const afterInit = async (): Promise<void> => {
  const lang: string = i18next.language;
  document.documentElement.lang = lang;
  onLanguageChanged(getLanguageFromPath() ?? lang);
  await loadLocale(lang);
};

const setupListeners = async (): Promise<void> => {
  window.addEventListener("popstate", popstateListener);
  i18next.on("languageChanged", onLanguageChanged);
  i18next.on("languageChanged", loadLocale);
  i18next.store.on("added", onAddedLanguageHandler);
};

export {
  withTranslation,
  indexOfLangPath,
  onLanguageChanged,
  getLanguageFromPath,
  loadLocale,
  onAddedLanguageHandler,
  popstateListener,
  afterInit,
  setupListeners,
};
