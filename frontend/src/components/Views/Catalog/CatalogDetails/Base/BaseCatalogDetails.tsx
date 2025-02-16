// BaseCatalogDetails.tsx
import { ReactNode } from "react";
import { ClothesContextActions } from "components/Context/ClothesContext";
import UIReact from "utils/classes/UIReact";
import { debounce } from "utils/hooks/debounce";
import { ClothesListActions } from "components/Context/ClothesListContext";
import { origin } from "../../../../../../project.config.json";
import SpinnerLoaderWrapperFixed from "components/Loaders/SpinnerLoaderWrapperFixed";
import {
  AddToCartPayload,
  CartContextActions,
} from "components/Context/CartContext";

export interface BaseCatalogState { }

export interface BaseCatalogProps
  extends ClothesContextActions,
  ClothesListActions,
  CartContextActions { }

abstract class BaseCatalogDetails<P = {}>
  extends UIReact<BaseCatalogProps & P, BaseCatalogState> {
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

  componentDidUpdate(prevProps: Readonly<BaseCatalogProps & P>): void {
    if (this.props.data && prevProps.data !== this.props.data) {
      const { colors, sizes, catalogImages, count } = this.props.data;
      this.props.setSelectedOptions({
        color: colors && colors.length > 0 ? colors[0].color : "",
        size: sizes && sizes.length > 0 ? sizes[0].size : "",
        quantity: count <= 0 ? 0 : 1,
        selectedImage:
          catalogImages && catalogImages.length > 0 ? catalogImages[0].image : null,
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

  getGlobalQuantity(): number {
    const { cart, data } = this.props;
    return (
      cart?.items
        ?.filter((item) => item.product.id === data?.id)
        .reduce((sum, item) => sum + item.quantity, 0) || 0
    );
  }

  handleOptionChange = (optionType: string, value: string | number): void => {
    this.props.setSelectedOptions({ [optionType]: value });
  };

  handleImageClick = (image: string): void => {
    this.props.setSelectedOptions({ selectedImage: image });
  };

  handleAddToCart = async (): Promise<void> => {
    const { data, selectedOptions } = this.props;
    if (!data) return;
    const finalColor = selectedOptions.color && selectedOptions.color.trim() !== ""
      ? selectedOptions.color
      : "";
    const finalSize = selectedOptions.size && selectedOptions.size.trim() !== ""
      ? selectedOptions.size
      : "";
    const finalImage = selectedOptions.selectedImage ? selectedOptions.selectedImage : null;

    const payload: AddToCartPayload = {
      product_id: data.id,
      quantity: selectedOptions.quantity || 1,
      selected_color: finalColor,
      selected_size: finalSize,
      selected_image: finalImage,
    };

    await this.props.addToCart(payload);
  };



  render(): ReactNode {
    const { loading, error } = this.props;
    if (loading) {
      return <SpinnerLoaderWrapperFixed />;
    }
    if (error) {
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
