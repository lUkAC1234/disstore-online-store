import { PureComponent, ReactNode } from "react";
import SpinnerLoaderWrapper from "./SpinnerLoaderWrapper";

class SpinnerLoaderWrapperFixed extends PureComponent {
  render(): ReactNode {
    return <SpinnerLoaderWrapper fixedPosition />;
  }
}

export default SpinnerLoaderWrapperFixed;
