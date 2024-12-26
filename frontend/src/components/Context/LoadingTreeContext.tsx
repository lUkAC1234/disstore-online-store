import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { LoadingTreeContext } from "./ContextCollection";

export interface LoadingTreeContextState {
  isLoading: boolean;
}

export interface LoadingTreeContextStateWithActions extends LoadingTreeContextState {
  setLoadingState: (isLoading: boolean) => void;
}

export interface LoadingTreeContextProps extends PropsWithChildren {}

class LoadingTreeContextProvider extends PureComponent<LoadingTreeContextProps, LoadingTreeContextState> {
  state: Readonly<LoadingTreeContextState> = {
    isLoading: false,
  };

  render(): ReactNode {
    return (
      <LoadingTreeContext.Provider
        value={{
          ...this.state,
          setLoadingState: this.setLoadingState,
        }}
      >
        {this.props.children}
      </LoadingTreeContext.Provider>
    );
  }

  componentDidUpdate(prevProps: Readonly<LoadingTreeContextProps>, prevState: Readonly<LoadingTreeContextState>): void {
    if (prevState.isLoading !== this.state.isLoading) {
      if (this.state.isLoading) {
        console.log("Is loading...");

        setTimeout(() => {
          this.setLoadingState(false);
        }, 3000);
      }
    }
  }

  setLoadingState = (isLoading: boolean): void => {
    this.setState({ isLoading });
  }
}

export default LoadingTreeContextProvider;
