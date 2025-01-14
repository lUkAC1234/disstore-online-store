import { PropsWithChildren, PureComponent } from "react";
import { ClothesListContext } from "./ContextCollection";
import { Clothestypes, ClothItem, Size, Color } from "./ClothesContext";
import { origin } from "../../../project.config.json";

export interface ClothesListContextState {
  products: ClothItem[];
  sizes: Size[];
  type: Clothestypes[];
  selectedSizes: number[];
  selectedTypes: number[];
  selectedColors: number[];
  selectedMin: number;
  selectedMax: number;
  currentPage: number;
  nextPage: string | null;
  prevPage: string | null;
  totalPages: number;
  count: number;
  colors: Color[];
  loading: boolean;
  loadingProducts: boolean,
  error: boolean;
  min: number;
  max: number
}

export interface ClothesListContextProps extends PropsWithChildren { }

export interface ClothesListActions extends ClothesListContextState {
  setProducts: (products: ClothItem[]) => void;
  setTypes: (type: Clothestypes[]) => void;
  setColors: (colors: Color[]) => void;
  setSizes: (sizes: Size[]) => void;
  setLoadingProducts: (setLoadingProducts: boolean) => void;
}

class ClothesListProvider extends PureComponent<ClothesListContextProps, ClothesListContextState> {
  state: Readonly<ClothesListContextState> = {
    products: [],
    selectedSizes: [],
    selectedTypes: [],
    selectedColors: [],
    sizes: [],
    type: [],
    colors: [],
    loading: false,
    loadingProducts: false,
    error: false,
    min: 0,
    max: 0,
    selectedMin: 0,
    selectedMax: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
    totalPages: 1,
    count: 0,
  };

  render() {
    return (
      <ClothesListContext.Provider
        value={{
          ...this.state,
          setProducts: this.setProducts,
          setTypes: this.setTypes,
          setColors: this.setColors,
          setSizes: this.setSizes,
          setLoadingProducts: this.setLoadingProducts,
        }}
      >
        {this.props.children}
      </ClothesListContext.Provider>
    );
  }

  async componentDidMount() {
    const cachedProducts = sessionStorage.getItem("c");

    if (cachedProducts) {
      this.setProducts(JSON.parse(cachedProducts));
    } else {
      this.fetchProducts();
    }
  }

  fetchProducts = async (): Promise<void> => {
    try {
      this.setLoadingState(true);

      const response = await fetch(`${origin}/clothes/?page=${this.state.currentPage}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      this.setProducts(data.results);
      this.setState((prevState) => ({
        ...prevState,
        totalPages: data.total_pages,
        min: data.price_min,
        max: data.price_max,
      }));
    } catch (error) {
      this.setErrorState();
    } finally {
      this.setLoadingState(false);
    }
  };

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

  setLoadingProducts = (value: boolean): void => {
    this.setState(prevState => ({
      ...prevState,
      loadingProducts: value,
    }));
  };

  setTypes = (type: Clothestypes[]): void => {
    this.setState(prevState => ({
      ...prevState,
      type,
    }));
  };
  
  setColors = (colors: Color[]): void => {
    this.setState(prevState => ({
      ...prevState,
      colors,
    }));
  };

  setSizes = (sizes: Size[]): void => {
    this.setState(prevState => ({
      ...prevState,
      sizes,
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
