import { lazy, ReactNode, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { supportedLanguages } from "i18n/constants";
import { getWithTranslation } from "i18n/hooks";
import { COMPONENT } from "services/utils/Injectors";
import UIReact from "utils/classes/UIReact";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Home = lazy(() => import("components/Views/Home/Home"));
const Catalog = lazy(() => import("components/Views/Catalog"));
const Error404 = lazy(() => import("components/Views/404"));

@COMPONENT<RouterView>({
  template: (_this) => {
    return (
      <>
        <Header />
        <main className="main">
          <Routes>
            {_this.routes}
          </Routes>
          <Outlet />
        </main>
        <Footer />
      </>
    );
  }
})
class RouterView extends UIReact<RouterViewProps, RouterViewState> {
  state: Readonly<RouterViewState> = {
    pathname: location.pathname,
    routesMap: new Map([
      ["/", { path: "/", element: <Navigate to={`/${this.props.i18n.language}`} />, index: true }],
      ["/:lang", { path: "/:lang", element: <Suspense fallback={<SpinnerLoaderWrapperFixed />}><Home /></Suspense>, index: true }],
      ["/:lang/catalog", { path: "/:lang/catalog", element: <Suspense fallback={<SpinnerLoaderWrapperFixed />}><Catalog /></Suspense> }],
      ["/*", { path: "/*", element: <Suspense fallback={<SpinnerLoaderWrapperFixed />}><Error404 /></Suspense> }],
    ]),
  };

  get routes(): ReactNode {
    return Array
      .from(this.state?.routesMap)
      .map(([, { path, element, index }], key) =>
        <Route
          path={path}
          element={element}
          index={index}
          key={key}
        />
      );
  }

  componentDidMount(): void {
    this.redirectOnUnknownLang();
    this.manageWindowEvents("addEventListener");
  }

  componentDidUpdate(prevProps: Readonly<RouterViewProps>): void {
    if (location.pathname !== this.state.pathname) {
      this.updatePathname();
      this.handleLanguageChange();
    }

    this.redirectOnUnknownLang();
  }

  manageWindowEvents(action: "addEventListener" | "removeEventListener"): void {
    const options: AddEventListenerOptions = { signal: this.controller.signal };
    window[action]("popstate", this.popstateHandler, options);
    window[action]("pushstate", this.updatePathname, options);
    window[action]("replacestate", this.updatePathname, options);
    window[action]("popstate", this.updatePathname, options);
  }

  updatePathname = (): void => {
    this.setState(prevState => ({
      ...prevState,
      pathname: location.pathname,
    }));
  }

  popstateHandler = (): void => {
    this.handleLanguageChange();
  }

  handleLanguageChange(): void {
    const pathname: string = location.pathname;
    const splitted: string[] = pathname.split("/");
    const lang: string = splitted[1];
    const { i18n } = this.props;

    if (supportedLanguages.includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }

    // if (!supportedLanguages.includes(lang)) return;
  }

  redirectOnUnknownLang(): void {
    const lang: string = this.props.i18n.language;
    const splitted: string[] = location.pathname.split("/");
    let pathWithoutLang: string = "";

    for (let i = 0; i < splitted.length; ++i) {
      if (i > 1) {
        if (i >= splitted.length - 1) {
          pathWithoutLang += splitted[i];
        } else {
          pathWithoutLang += splitted[i] + "/";
        }
      }
    }

    if (this.state.pathname.split("/")[1] && !supportedLanguages.includes(this.state.pathname.split("/")[1])) {
      if (pathWithoutLang) {
        history.replaceState(null, "", `/${lang}/${pathWithoutLang}`);
      } else {
        history.replaceState(null, "", `/${lang}`);
      }
    }
  }
}

const UIRouterView = getWithTranslation(RouterView);

export { RouterView };
export default UIRouterView;
