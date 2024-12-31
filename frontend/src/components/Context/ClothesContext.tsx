import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { ClothesContext } from "./ContextCollection";

export interface ClothItem {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  colors: number[];
}

export interface ClothesContextState {
  data: ClothItem[];
}
export interface ClothesContextProps extends PropsWithChildren {}
export interface ClothesContextActions extends ClothesContextState {
  setData: (data: ClothItem[]) => void;
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

  setData = (data: ClothItem[]): void => {
    this.setState({ data });
  }
}

export default ClothesContextProvider;
