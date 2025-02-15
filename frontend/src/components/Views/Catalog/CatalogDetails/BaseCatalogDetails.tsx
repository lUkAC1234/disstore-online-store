// BaseCatalogDetails.tsx
import { ReactNode } from "react";
import { ClothesContextActions, ClothItem } from "components/Context/ClothesContext";
import UIReact from "utils/classes/UIReact";
import { debounce } from "utils/hooks/debounce";
import { ClothesListActions } from "components/Context/ClothesListContext";
import { origin } from "../../../../../project.config.json";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";

export interface BaseCatalogState {
  selectedOptions: {
    color: string;
    size: string;
    quantity: number;
  };
  selectedImage: string | null;
}

/**
 * This abstract class extends UIReact using the same generic signature as before.
 * Props: ClothesContextActions & ClothesListActions & P (defaulting to {}).
 * State: ProductOptionsState.
 */
abstract class BaseCatalogDetails<P = {}> extends UIReact<ClothesContextActions & ClothesListActions & P, BaseCatalogState> {
  state: BaseCatalogState = {
    selectedImage: null,
    selectedOptions: {
      color: "",
      size: "",
      quantity: 1,
    },
  };

  abstract getProductSlug(): string;
  abstract get lang(): string;
  abstract renderContent(): ReactNode;

  async componentDidMount(): Promise<void> {
    await this.fetchData();
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.props.setData(null);
  }

  componentDidUpdate(prevProps: Readonly<ClothesContextActions & ClothesListActions & P>): void {
    if (prevProps.data !== this.props.data && this.props.data) {
      const { colors, sizes, catalogImages } = this.props.data;
      this.setState({
        selectedOptions: {
          color: colors?.[0]?.color || "",
          size: sizes?.[0]?.size || "",
          quantity: this.props.data?.count <= 0 ? 0 : 1,
        },
        selectedImage: catalogImages?.[0]?.image || null,
      });
    }
  }

  fetchData = debounce(async () => {
    await this.fetchDataProduct(this.getProductSlug());
  }, 100);

  async fetchDataProduct(productSlug: string): Promise<void> {
    try {
      const cachedData = sessionStorage.getItem(productSlug);
      if (cachedData) {
        this.props.setData(JSON.parse(cachedData));
        return;
      }

      const response = await fetch(`${origin}/clothes/${productSlug}/`, {
        signal: this.controller!.signal,
      });

      if (!response.ok) {
        if (response.status === 404) {
          window.location.href = `/${this.lang}/page-not-found-404`;
          return;
        }
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      sessionStorage.setItem(productSlug, JSON.stringify(data));
      this.props.setData(data);
    } catch (err) {
      console.error(err);
    }
  }

  handleOptionChange = (optionType: string, value: string | number) => {
    this.setState(prev => ({
      selectedOptions: { ...prev.selectedOptions, [optionType]: value }
    }));
  };

  handleQuantityChange = (type: "increase" | "decrease", maxAvailable: number) => {
    this.setState(prev => ({
      selectedOptions: {
        ...prev.selectedOptions,
        quantity: Math.min(
          Math.max(
            type === "increase" ? prev.selectedOptions.quantity + 1 : prev.selectedOptions.quantity - 1,
            1
          ),
          maxAvailable,
          100
        )
      }
    }));
  };

  handleImageClick = (image: string): void => {
    this.setState({ selectedImage: image });
  };

  render(): ReactNode {
    if (this.props.loading) {
      return <SpinnerLoaderWrapperFixed />;
    }
    if (this.props.error) {
      return (
        <div>
          <h2>Something went wrong!</h2>
        </div>
      );
    }
    return <section>{this.renderContent()}</section>;
  }
}

export default BaseCatalogDetails;
