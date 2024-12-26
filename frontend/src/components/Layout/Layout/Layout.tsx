import { lazy, ReactNode, Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper";

const RouterView = lazy(() => import("components/Layout/Router/Router"));

function Layout(): ReactNode {
  return (
    <Router>
      <Suspense fallback={<SpinnerLoaderWrapper fixedPosition />}>
        <RouterView />
      </Suspense>
    </Router>
  );
}

export default Layout;
