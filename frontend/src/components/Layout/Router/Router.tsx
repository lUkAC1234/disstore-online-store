import { lazy, ReactNode, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { supportedLanguages } from "i18n/constants";
import { getWithTranslation } from "i18n/hooks";
import { COMPONENT } from "decorators/Component";
import UIReact from "utils/classes/UIReact";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import GlobalModal from "components/Modal/GlobalModal";

// Lazy-loaded components
const Home = lazy(() => import("components/Views/Home/Home"));
const Aboutus = lazy(() => import("components/Views/AboutUs/AboutUs"));
const CatalogList = lazy(() => import("components/Views/Catalog/CatalogList/CatalogList"));
const ClothesDetails = lazy(() => import("components/Views/Catalog/CatalogDetails/CatalogDetails"));
const Error404 = lazy(() => import("components/Views/Errors/error404/404"));
const Cart = lazy(() => import("components/Views/Cart/Cart"));
const WishList = lazy(() => import("components/Views/WishList/WishList"));
const Authentication = lazy(() => import("components/Views/Authentication/Authentication"));
const Checkout = lazy(() => import("components/Views/Checkout/Checkout"));
const Profile = lazy(() => import("components/Views/Authentication/Profile/Profile"));

@COMPONENT<RouterView>({
  template: (_this) => {
    const segments = _this.state.pathname.split("/");
    const hideLayout = segments[2] === "authentication";
    return (
      <>
        {!hideLayout && <Header />}
        <main className={`main ${hideLayout ? "no-header" : ""}`}>
          <Routes>{_this.routes}</Routes>
          <Outlet />
        </main>
        {!hideLayout && <Footer />}
        <GlobalModal />
      </>
    );
  },
})

class RouterView extends UIReact<RouterViewProps, RouterViewState> {
  state: Readonly<RouterViewState> = {
    pathname: location.pathname,
    routesMap: new Map([
      ["/", { path: "/", element: <Navigate to={`/${this.props.i18n.language}`} />, index: true }],
      ["/:lang", { path: "/:lang", element: <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}><Home /></Suspense>, index: true }],
      ["/:lang/about/us", { path: "/:lang/about/us", element: <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}><Aboutus /></Suspense> }],
      ["/:lang/catalog", { path: "/:lang/catalog", element: <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}><CatalogList /></Suspense> }],
      ["/:lang/catalog/clothes/:id", { path: "/:lang/catalog/clothes/:slug", element: <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}><ClothesDetails /></Suspense> }],
      ["/:lang/cart", { path: "/:lang/cart", element: <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}><Cart /></Suspense> }],
      ["/:lang/checkout", { path: "/:lang/checkout", element: <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}><Checkout /></Suspense> }],
      ["/:lang/favorites", { path: "/:lang/favorites", element: <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}><WishList /></Suspense> }],
      ["/:lang/authentication", { path: "/:lang/authentication", element: <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}><Authentication /></Suspense> }],
      ["/:lang/profile", { path: "/:lang/profile", element: <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}><Profile /></Suspense> }],
      ["/*", { path: "/*", element: <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}><Error404 /></Suspense> }],
    ]),
  };

  get routes(): ReactNode {
    return Array.from(this.state?.routesMap).map(([, { path, element, index }], key) => (
      <Route path={path} element={element} index={index} key={key} />
    ));
  }

  componentDidMount(): void {
    this.redirectOnUnknownLang();
    this.manageWindowEvents("addEventListener");
  }

  componentDidUpdate(): void {
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
    this.setState((prevState) => ({
      ...prevState,
      pathname: location.pathname,
    }));
  };

  popstateHandler = (): void => {
    this.handleLanguageChange();
  };

  handleLanguageChange(): void {
    const pathname: string = location.pathname;
    const splitted: string[] = pathname.split("/");
    const lang: string = splitted[1];
    const { i18n } = this.props;

    if (supportedLanguages.includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
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
