import { PureComponent } from "react";
import { WithTranslation } from "react-i18next";
import IService from "./IService";

class LangService<CTX extends PureComponent<unknown & WithTranslation, unknown>> extends IService<CTX> {
  private get i18n() {
    return this.ctx.props.i18n;
  }

  get lang(): string {
    return this.i18n.language;
  }

  constructor(ctx: CTX) {
    super(ctx);
    if (!this.i18n) {
      throw new Error("Your component is not connected to i18next!");
    }
  }

  t(key: string | TemplateStringsArray | (string | TemplateStringsArray)[]): string {
    return this.ctx.props.t(key);
  }

  changeLanguage(lng: string, callback?: () => void): void {
    this.i18n.changeLanguage(lng, callback);
  }

  getTranslatedPathname(path: string): string {
    return (path[0] === "/")
      ? `/${this.lang}${path}`
      : `/${this.lang}/${path}`;
  }
}

export default LangService;
