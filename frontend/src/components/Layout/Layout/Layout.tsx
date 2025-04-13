import { lazy, PureComponent, ReactNode, Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import LazyLoaded from "components/UI/Async/LazyLoaded";

const RouterView = lazy(() => import("components/Layout/Router/RouterView"));
const UIMessages = lazy(() => import("components/Views/Messages/Messages"));
const GlobalModal = lazy(() => import("components/Modal/GlobalModal"));

class Layout extends PureComponent {
  render(): ReactNode {
    return (
      <Router>
        <LazyLoaded>
          <RouterView />
        </LazyLoaded>
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
