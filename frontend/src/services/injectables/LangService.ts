import { WithTranslation } from "react-i18next";

class LangService<P extends WithTranslation> {
  readonly props: Readonly<P>;

  get lang(): string {
    return this.props.i18n.language;
  }

  getTranslatedPathname(path: string): string {
    return (path[0] === "/")
      ? `/${this.lang}${path}`
      : `/${this.lang}/${path}`;
  }

  t(key: string | TemplateStringsArray | (string | TemplateStringsArray)[]): string {
    if (!this?.props) {
      console.warn("There is no props property");
      return;
    }
    return this.props.t(key);
  }

  changeLanguage(lng: string, callback?: () => void): void {
    this.props.i18n.changeLanguage(lng, callback);
  }
}

export default LangService;
