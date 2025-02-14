import { supportedLanguages } from "i18n/constants";
import IService from "./IService";

export function withoutLangPathname(): string {
  const splittedPathname: string[] = location.pathname.split("/");
  let finalPathname: string = "";

  for (let i = 0; i < splittedPathname.length; ++i) {
    const path = splittedPathname[i];
    if (i > 1) {
      finalPathname += `/${path}`;
    }
  }

  if (finalPathname === "") {
    return "/";
  }

  return finalPathname;
}

class LocationService<CTX> extends IService<CTX> {
  get pathname(): string {
    return location.pathname;
  }

  get splittedPathname(): string[] {
    return this.pathname.split("/");
  }

  get langPath(): string {
    const langPathIndex: number = this.splittedPathname.findIndex(lng => supportedLanguages.includes(lng));
    if (langPathIndex === -1) return;
    return this.splittedPathname[langPathIndex];
  }

  get withoutLangPathname(): string {
    return withoutLangPathname();
  }

  get isHttp(): boolean {
    return location.protocol === "http:";
  }

  get isHttps(): boolean {
    return location.protocol === "https:";
  }
}

export default LocationService;
