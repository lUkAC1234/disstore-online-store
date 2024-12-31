import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { ClothesContext } from "./ContextCollection";

export interface ClothesContextState {
  data: unknown;
}
export interface ClothesContextProps extends PropsWithChildren {}
export interface ClothesContextActions extends ClothesContextState {
  setData: (data: unknown) => void;
}

class ClothesContextProvider extends PureComponent<ClothesContextProps, ClothesContextState> {
  state: Readonly<ClothesContextState> = {
    data: null,
  };

  render(): ReactNode {
    return (
      <ClothesContext.Provider
        value={{
          ...this.state,
          setData: this.setData,
        }}
      >
        {this.props.children}
      </ClothesContext.Provider>
    );
  }

  setData = (data: unknown): void => {
    this.setState({ data });
  }
}

export default ClothesContextProvider;
