import { PureComponent, ComponentType, ReactNode } from "react";
import LazyLoaded from "components/UI/Async/LazyLoaded";

function withLazyLoadedWrap<T>(Component: ComponentType<T>): ComponentType<T> {
  return class LazyLoadWrapper extends PureComponent<T> {
    render(): ReactNode {
      return (
        <LazyLoaded>
          <Component {...this.props as T} />
        </LazyLoaded>
      );
    }
  } as ComponentType<T>;
}

export default withLazyLoadedWrap;