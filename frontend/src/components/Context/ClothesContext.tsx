import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { ClothesContext } from "./ContextCollection";

export interface Color {
  id: number;
  name: string;
  color: string;
}

export interface Size {
  id: number;
  size: string;
}

export interface CatalogImage {
  id: number;
  product: number;
  image?: string | null;
  thumbnail?: string | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Reviews {
  id: number;
  product: number;
  user: User[];
  text: string;
  created_at: string;
  is_allowed: boolean;
}

export interface FAQs {
  id: number;
  product: number;
  question: string;
  answer: string;
}

export interface Clothestypes {
  id: number;
  title: string;
  image: string;
}

export interface ClothItem {
  id: number;
  title: string;
  short_description: string;
  long_description: string;
  slug: string;
  discount: number;
  price: number;
  real_price: number;
  count: number;
  type: Clothestypes;
  colors: Color[];
  sizes: Size[];
  catalogImages: CatalogImage[];
  reviews: Reviews[];
  faqs: FAQs[];
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
    this.setState({ data });
  }
}

export default ClothesContextProvider;
