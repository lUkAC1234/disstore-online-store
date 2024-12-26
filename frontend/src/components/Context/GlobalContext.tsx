import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { autoBindMethods } from "utils/hooks/bind";
import { GlobalContext } from "./ContextCollection";

export { GlobalContext };

export interface GlobalContextProps extends PropsWithChildren {}
export interface GlobalContextState {
  fancyboxIsAttached: boolean;
}

export interface GlobalContextStateWithActions extends GlobalContextState {
  setFancyboxAttachStatus: (value: boolean) => void;
}

class GlobalContextProvider extends PureComponent<GlobalContextProps, GlobalContextState> implements BindMethods {
  state: Readonly<GlobalContextState> = {
    fancyboxIsAttached: false,
  };

  methods: BindItem[] = [
    { func: this.setFancyboxAttachStatus, context: this },
  ];

  constructor(props: Readonly<GlobalContextProps>) {
    super(props);
    autoBindMethods(this);
  }

  render(): ReactNode {
    return (
      <GlobalContext.Provider value={{
        ...this.state,
        setFancyboxAttachStatus: this.setFancyboxAttachStatus,
      }}>
        {this.props.children}
      </GlobalContext.Provider>
    );
  }

  setFancyboxAttachStatus(value: boolean): void {
    this.setState(prevState => ({
      ...prevState,
      fancyboxIsAttached: value,
    }));
  }
}

export default GlobalContextProvider;
