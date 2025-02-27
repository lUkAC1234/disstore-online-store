import { lazy, ReactNode, Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import store from "store/Redux-store";
import i18n from "i18n/langs";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";
import GlobalModal from "components/Modal/GlobalModal";
import { ModalHandler } from "components/Modal/Modal.utils";

const ContextProviders = lazy(() => import("components/Context/ContextProviders"));
const Layout = lazy(() => import("components/Layout/Layout/Layout"));

function App(): ReactNode {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}>
          <ContextProviders>
            <Suspense fallback={<SpinnerLoaderWrapperFixed withBackground />}>
              <Layout />
              <GlobalModal />
            </Suspense>
          </ContextProviders>
        </Suspense>
      </I18nextProvider>
    </Provider>
  );
}

export default App;
