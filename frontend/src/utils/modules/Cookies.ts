class Cookies {
  static setCookie(name: string, value: string, days: number) {
    const date: Date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires: string = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict;HttpOnly;Secure;`; // doesn't keep the cookie when protocol is Http.
  }

  static getCookie(name: string): string | null {
    const splittedCookieList: string[] = document.cookie.split("; ");
    let foundValue: string = "";

    for (let i: number = 0; i < splittedCookieList.length; ++i) {
      const cookie: string = splittedCookieList[i];
      const splittedCookie = cookie.split("=");
      const cookieName: string = splittedCookie[0];
      const value: string = splittedCookie[1];

      if (cookieName === name) {
        foundValue = value;
        break;
      }
    }

    return foundValue;
  }

  static deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  }
}

export default Cookies;
