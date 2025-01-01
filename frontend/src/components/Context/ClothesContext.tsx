import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { ClothesContext } from "./ContextCollection";

export interface Color {
  id: number;
  color: string;
}

export interface Size {
  id: number;
  size: string;
}

export interface CatalogImage {
  id: number;
  product: number;
  image: string;
}

export interface ClothItem {
  id: number;
  title: string;
  description: string;
  price: number;
  colors: Color[];
  sizes: Size[];
  catalogImages: CatalogImage[];
}

export interface ClothesContextState {
  data: ClothItem;
}

export interface ClothesContextProps extends PropsWithChildren {}

export interface ClothesContextActions extends ClothesContextState {
  setData: (data: ClothItem) => void;
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

  setData = (data: ClothItem): void => {
    this.setState({ data }, () => console.log(data));
  }
}

export default ClothesContextProvider;
