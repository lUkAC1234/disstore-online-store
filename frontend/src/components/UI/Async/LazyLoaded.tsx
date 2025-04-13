import { PropsWithChildren, PureComponent, ReactNode, Suspense } from "react";
import SpinnerLoaderWrapper from "components/Loaders/SpinnerLoaderWrapper"; 

interface ILazyLoadedProps extends PropsWithChildren {
  fallbackUI?: ReactNode;
}

class LazyLoaded extends PureComponent<ILazyLoadedProps> {
  render(): ReactNode {
    return (
      <Suspense fallback={this.props.fallbackUI ?? <SpinnerLoaderWrapper fixedPosition />}>
        {this.props.children}
      </Suspense>
    );
  }
}

export default LazyLoaded;
