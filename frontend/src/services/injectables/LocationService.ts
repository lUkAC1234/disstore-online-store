import { withoutLangPathname } from "services/classes/LocationService";

function indexOfLangPath(): number {
  const segments = location.pathname.split("/");
  const supportedLanguages = ["en", "ru"];
  for (let i = 0; i < segments.length; i++) {
    if (segments[i] && supportedLanguages.includes(segments[i])) {
      return i;
    }
  }
  return -1;
}

class LocationService {
  get pathname(): string {
    return location.pathname;
  }

  get splittedPathname(): string[] {
    return this.pathname.split("/");
  }

  get langPath(): string {
    const langPathIndex: number = indexOfLangPath();
    if (langPathIndex === -1) return "";
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
