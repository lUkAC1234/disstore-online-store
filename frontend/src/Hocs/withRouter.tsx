import { ComponentType, PureComponent, ReactNode } from "react";

interface WithRouterState {
  pathname: string;
}

export interface WithRouterProps extends WithRouterState {}

function withRouter<TProps>(WrapperComponent: ComponentType<TProps>): ComponentType<Omit<TProps, keyof WithRouterState>> {
  return class WithRouter extends PureComponent<Omit<TProps, keyof WithRouterState>, WithRouterState> {
    state: Readonly<WithRouterState> = {
      pathname: location.pathname,
    };

    render(): ReactNode {
      return <WrapperComponent
        {...this.props as TProps}
        {...this.state}
      />;
    }

    componentDidMount(): void {
      window.addEventListener("popstate", this.updatePathname);
      window.addEventListener("pushstate", this.updatePathname);
    }

    componentWillUnmount(): void {
      window.removeEventListener("popstate", this.updatePathname);
      window.removeEventListener("pushstate", this.updatePathname);
    }

    updatePathname = (): void => {
      this.setState({ pathname: location.pathname });
    }
  }
}

export default withRouter;