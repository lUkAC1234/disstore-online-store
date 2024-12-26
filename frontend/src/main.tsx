import "./Fonts";
import "assets/main/styles/scss/global.scss";
import HistoryAPI from "utils/events/HistoryAPI";
import FadeInAnimationAPI from "utils/classes/FadeInAnimationAPI";
import ReactApplication from "utils/classes/ReactApplication";
import App from "./App";

const appNode: HTMLElement = document.getElementById("app");
const app = new ReactApplication({ appNode, jsx: <App /> });

app.setupAPIs(() => {
  new HistoryAPI()
    .setupEventDispatchers();

  new FadeInAnimationAPI(appNode)
    .observe();
});

app.renderApp();
