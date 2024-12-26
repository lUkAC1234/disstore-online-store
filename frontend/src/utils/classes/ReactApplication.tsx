import { ReactNode, StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import { reactDevTools, metaLocales } from "../../../project.config.json";
import debug from "constants/debug";
import i18next from "i18next";

export interface ReactApplicationConfig {
  appNode: HTMLElement | null;
  jsx: ReactNode | JSX.Element;
}

class ReactApplication {
  public root: Root;
  public jsx: ReactNode;
  public appNode: HTMLElement;
  private commentNode: Comment;
  private commentNodeIsSet: boolean;

  constructor(config: ReactApplicationConfig) {
    try {
      this.setupMetaDescriptions();
      const { appNode, jsx, } = config;

      console.assert(appNode, "App node is undefined!");
      if (!appNode) {
        throw new TypeError("App node is undefined!");
      }

      this.setupRoot(appNode, jsx);

      if (debug) {
        this.commentNode = new Comment("REACT DEV IS RUNNING...");
        setTimeout(this.appendCommentNodeToBody, 1500);
      }

      if (!reactDevTools) {
        this.disableReactDevTools();
      }
    } catch (err) {
      console.error(err);
    }
  }

  private setupMetaDescriptions(): void {
    const metaDescription: HTMLMetaElement = document.head.querySelector("meta[name='description']");

    const setMetaDescription = (lang: string): void => {
      if (!metaDescription) return;
      metaDescription.setAttribute("content", metaLocales?.[lang]?.description);
    };

    setMetaDescription(i18next.language);
    i18next.on("languageChanged", setMetaDescription);
  }

  private setupRoot(appNode: HTMLElement | null, jsx: ReactNode): void {
    this.appNode = appNode;
    this.jsx = jsx;
    this.root = createRoot(this.appNode!);
  }

  public renderApp(): ReactApplication {
    if (debug) {
      this.logDevMessage();
      this.root.render(<StrictMode>{this.jsx}</StrictMode>);
    } else {
      this.logProdMessage();
      this.root.render(this.jsx);
    }
    return this;
  }

  public setupAPIs(callback: () => void): ReactApplication {
    callback();
    return this;
  }

  public logProdMessage(): void {
    if (!metaLocales?.[i18next.language]?.description) {
      return;
    }
    const consoleStyles: string = "background-color:#71AA0E;color:white;font-size:20px;padding:40px;";
    console.log(`%cGreen Tashkent - ${metaLocales?.[i18next.language]?.description}`, consoleStyles);
  }

  public logDevMessage(): void {
    const consoleStyles: string = "background-color:blue;color:white;font-size:20px;padding:10px;";
    console.log("%cREACT APPLICATION RENDERS ON DEV MODE", consoleStyles);
  }

  private appendCommentNodeToBody = (): void => {
    if (!this.commentNodeIsSet) {
      const appNode: HTMLElement = document.querySelector("#app");
      document.body.insertBefore(this.commentNode, appNode);
      this.commentNodeIsSet = true;
    }
  }

  private async disableReactDevTools(): Promise<void> {
    const module = await import("utils/hooks/disableReactDevTools");
    const disableReactDevTools = module.default;
    disableReactDevTools(); // disables React Dev Tools
  }
}

export default ReactApplication;
