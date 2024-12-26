import i18next from "i18next";
import resources from "i18n/resources";
import { debug } from "../../project.config.json";
import { initReactI18next } from "react-i18next";
import { getLanguageFromPath, onLanguageChanged } from "i18n/hooks";
import { defaultLng } from "./constants";

i18next
.use(initReactI18next)
.init({
  lng: getLanguageFromPath() ?? defaultLng,
  fallbackLng: defaultLng,
  debug,
  resources,
  interpolation: {
    escapeValue: false,
  },
});

document.documentElement.lang = i18next.language;
i18next.on("languageChanged", onLanguageChanged);

export default i18next;
