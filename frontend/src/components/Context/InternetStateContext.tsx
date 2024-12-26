import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { InternetStateContext } from "./ContextCollection";

export { InternetStateContext };

export interface InternetStateContextState {
  isOnline: boolean;
}

export interface InternetStateContextStateWithActions extends InternetStateContextState {}
export interface InternetStateContextProps extends PropsWithChildren {}

class InternetStateContextProvider extends PureComponent<InternetStateContextProps, InternetStateContextState> {
  state: Readonly<InternetStateContextState> = {
    isOnline: navigator.onLine,
  };

  render(): ReactNode {
    return (
      <InternetStateContext.Provider value={this.state}>
        {this.props.children}
      </InternetStateContext.Provider>
    );
  }

  componentDidMount(): void {
    this.manageEvents("addEventListener");
  }

  componentWillUnmount(): void {
    this.manageEvents("removeEventListener");
  }

  manageEvents(action: "addEventListener" | "removeEventListener"): void {
    window[action]("online", this.setOnline);
    window[action]("offline", this.setOffline);
  }

  setInternetState(value: boolean): void {
    this.setState({ isOnline: value });
  }

  setOnline = (): void => {
    this.setInternetState(true);
  }

  setOffline = (): void => {
    this.setInternetState(false);
  }
}

export default InternetStateContextProvider;
