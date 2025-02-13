import { lazy, ReactNode, Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import store from "store/Redux-store";
import i18n from "i18n/langs";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";
import Ping from "utils/classes/Ping";

const ContextProviders = lazy(() => import("components/Context/ContextProviders"));
const Layout = lazy(() => import("components/Layout/Layout/Layout"));

function App(): ReactNode {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<SpinnerLoaderWrapperFixed />}>
          <ContextProviders>
            <Suspense fallback={<SpinnerLoaderWrapperFixed />}>
              <Layout />
              <Ping />
            </Suspense>
          </ContextProviders>
        </Suspense>
      </I18nextProvider>
    </Provider>
  );
}

export default App;
