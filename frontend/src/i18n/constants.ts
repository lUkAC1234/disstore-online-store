import debug from "constants/debug";

function getSupportedLanguages(): string[] {
  const list: string[] = ["ru", "uz", "oz"];

  if (debug) {
    list.push("en");
  }

  return list;
}

export const defaultLng: string = "ru";
export const supportedLanguages: string[] = getSupportedLanguages();
