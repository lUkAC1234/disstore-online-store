import { lazy, PureComponent, ReactNode, Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";

const UIMessages = lazy(() => import("components/Views/Messages/Messages"));
const GlobalModal = lazy(() => import("components/Modal/GlobalModal"));
const RouterView = lazy(() => import("components/Layout/Router/Router"));

class Layout extends PureComponent {
  render(): ReactNode {
    return (
      <Router>
        <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}>
          <RouterView />
        </Suspense>
        <Suspense fallback={null}>
          <UIMessages />
        </Suspense>
        <Suspense fallback={null}>
          <GlobalModal />
        </Suspense>
      </Router>
    );
  }
}

export default Layout;
