import { indexOfLangPath } from "i18n/hooks";
import { withoutLangPathname } from "services/classes/LocationService";

class LocationService {
  get pathname(): string {
    return location.pathname;
  }

  get splittedPathname(): string[] {
    return this.pathname.split("/");
  }

  get langPath(): string {
    const langPathIndex: number = indexOfLangPath();
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
