import { lazy, PureComponent, ReactNode, Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";
import GlobalModal from "components/Modal/GlobalModal";

const RouterView = lazy(() => import("components/Layout/Router/Router"));

class Layout extends PureComponent {
  render(): ReactNode {
    return (
      <Router>
        <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}>
          <RouterView />
        </Suspense>
        <GlobalModal />
      </Router>
    );
  }
}

export default Layout;
