import { PureComponent } from "react";

class UIReact<P = object, S = object, SS = unknown> extends PureComponent<P, S, SS> {
  abortReason: string = "Default reason";
  controller?: AbortController = new AbortController();

  abortController(): void {
    this.controller.abort(`Aborting with reason: '${this.abortReason ?? "default reason"}'`);
  }

  componentWillUnmount(): void {
    this.abortController();
  }
}

export default UIReact;
