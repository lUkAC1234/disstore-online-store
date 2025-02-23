import { PureComponent, ReactNode } from "react";
import SpinnerLoaderWrapper from "./SpinnerLoaderWrapper";

interface SpinnerLoaderWrapperFixedProps {
  withBackground?: boolean;
}

class SpinnerLoaderWrapperFixed extends PureComponent<SpinnerLoaderWrapperFixedProps> {
  render(): ReactNode {
    return <SpinnerLoaderWrapper fixedPosition withBackground={this.props.withBackground} />;
  }
}

export default SpinnerLoaderWrapperFixed;
