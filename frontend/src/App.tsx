import { lazy, PureComponent, ReactNode, Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "i18n/langs";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";

const ContextProviders = lazy(() => import("components/Context/ContextProviders"));
const Layout = lazy(() => import("components/Layout/Layout/Layout"));

class App extends PureComponent {
  render(): ReactNode {
    return (
        <I18nextProvider i18n={i18n}>
          <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}>
            <ContextProviders>
              <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}>
                <Layout />
              </Suspense>
            </ContextProviders>
          </Suspense>
        </I18nextProvider>
    );
  }
}

export default App;
