import { defaultLng } from "i18n/constants";

class LocaleString {
  getLocaleStringStandard(value: number, locale?: string): string {
    return value?.toLocaleString(locale ?? defaultLng, { notation: "standard" });
  }

  capitalizeFirstLetter(text: string): string {
    return text?.charAt(0).toUpperCase() + text?.slice(1);
  }

  getBigNumberIndication(value: number, intSize: number, locale?: string): string {
    let computedMaxSize: string = "";
    let maxSize: number = 0;

    for (let i = 0; i < intSize; ++i) computedMaxSize += "9";
    maxSize = Number(computedMaxSize);

    if (value > maxSize) {
      return value?.toLocaleString(locale ?? defaultLng, { notation: "compact" });
    }
    return this.getLocaleStringStandard(value, locale);
  }
}

export default LocaleString;
