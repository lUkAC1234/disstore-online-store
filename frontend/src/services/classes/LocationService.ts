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
    return this.splittedPathname[1];
  }

  get withoutLangPathname(): string {
    return withoutLangPathname();
  }
}

export default LocationService;
