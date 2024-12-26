import { PureComponent } from "react";

interface SnapshotLogger extends PureComponent {}

class SnapshotLogger {
  componentDidUpdate(_prevProps: object, _prevState: object, snapshot?: unknown): void {
    console.log(snapshot);
  }

  getSnapshotBeforeUpdate(prevProps: object, prevState: object): unknown {
    return {
      prev: {
        props: prevProps,
        state: prevState,
      },
      curr: {
        props: this.props,
        state: this.state,
      },
    };
  }
}

export default SnapshotLogger;
