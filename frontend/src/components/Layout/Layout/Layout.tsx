import { lazy, ReactNode, Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";

const RouterView = lazy(() => import("components/Layout/Router/Router"));

function Layout(): ReactNode {
  return (
    <Router>
      <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}>
        <RouterView />
      </Suspense>
    </Router>
  );
}

export default Layout;
