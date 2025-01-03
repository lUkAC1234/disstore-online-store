import { PropsWithChildren, PureComponent } from "react";
import { ClothesListContext } from "./ContextCollection";
import { ClothItem } from "./ClothesContext";
import { origin } from "../../../project.config.json";

export interface ClothesListContextState {
  products: ClothItem[];
  loading: boolean;
  error: boolean;
}

export interface ClothesListContextProps extends PropsWithChildren {}

export interface ClothesListActions extends ClothesListContextState {
  setProducts: (products: ClothItem[]) => void;
}

class ClothesListProvider extends PureComponent<ClothesListContextProps, ClothesListContextState> {
  state: Readonly<ClothesListContextState> = {
    products: [],
    loading: false,
    error: false,
  };

  render() {
    return (
      <ClothesListContext.Provider
        value={{
          ...this.state,
          setProducts: this.setProducts,
        }}
      >
        {this.props.children}
      </ClothesListContext.Provider>
    );
  }

  componentDidMount(): void {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    try {
      const response: Response = await fetch(`${origin}`);
      this.setLoadingState(true);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: ClothItem[] = await response.json();
      this.setProducts(data);
    } catch (err) {
      this.setErrorState();
    } finally {
      this.setLoadingState(false);
    }
  }

  setErrorState = (): void => {
    this.setState(prevState => ({
      ...prevState,
      error: true,
      loading: false,
    }));
  }

  setLoadingState = (value: boolean): void => {
    this.setState(prevState => ({
      ...prevState,
      loading: value,
    }));
  };

  setProducts = (products: ClothItem[]): void => {
    this.setState(prevState => ({
      ...prevState,
      products,
      loading: false,
    }));
  };
}

export default ClothesListProvider;
