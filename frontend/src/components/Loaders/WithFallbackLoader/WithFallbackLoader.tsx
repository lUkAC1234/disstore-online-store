import { PureComponent, ReactNode, Suspense } from "react";
import SpinnerLoaderWrapper from "../SpinnerLoaderWrapper";

class WithFallbackLoader extends PureComponent<WithFallbackLoaderProps> {
  get computedFallback(): ReactNode {
    return this.props.fallback ?? <SpinnerLoaderWrapper />;
  }

  render(): ReactNode {
    return (
      <Suspense fallback={this.computedFallback}>
        {this.props.children}
      </Suspense>
    );
  }
}

export default WithFallbackLoader;
