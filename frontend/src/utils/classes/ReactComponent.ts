import { PureComponent } from "react";

class ReactComponent<P = object, S = object, SS = unknown> extends PureComponent<P, S, SS> {
  controller: AbortController = new AbortController();
  abortReason: string = "Default reason";

  componentWillUnmount(): void {
    this.controller.abort(`Aborting with reason: '${this.abortReason}'!`);
  }
}

export default ReactComponent;
