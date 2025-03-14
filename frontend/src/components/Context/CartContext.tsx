import { PropsWithChildren, PureComponent } from "react";
import { CartContext } from "./ContextCollection";
import { ClothItem } from "./ClothesContext";
import { origin } from "../../../project.config.json";
import Cookies from "utils/modules/Cookies";

export interface SelectedOptions {
  color: string;
  size: string;
  quantity: number;
  selectedImage: string | null;
}

export interface CartProviderProps extends PropsWithChildren { }

export interface CartItem {
  id: number;
  product: ClothItem;
  quantity: number;
}

export interface CartData {
  items: CartItem[];
  original_total: number;
  total_discount: number;
  final_total: number;
  discount_percentage: string;
}

export interface AddToCartPayload {
  product_id: number;
  quantity: number;
  selected_color: string;
  selected_size: string;
  selected_image: string | null;
}


export interface CartContextActions {
  cart: CartData | null;
  loadingCart: boolean;
  addToCart: (payload: AddToCartPayload) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  clearCart: () => void;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
  selectedOptions: SelectedOptions;
  setSelectedOptions: (options: Partial<SelectedOptions>) => void;
  setSuccessCart: (successCart: boolean, product?: ClothItem | null, quantity?: number) => void;
  setSuccessCheckout: (successCart: boolean) => void;
  closeSuccessCart: () => void;
  closeSuccessCheckoutCart: () => void;
  successCart: boolean;
  successCheckout: boolean;
  cartItem: CartItem | null;
}

export interface CartContextState {
  cart: CartData | null;
  cartItem: CartItem | null;
  loadingCart: boolean;
  selectedOptions: SelectedOptions;
  successCart: boolean;
  successCheckout: boolean;
}

class CartContextProvider extends PureComponent<CartProviderProps, CartContextState> {
  render() {
    return (
      <CartContext.Provider
        value={{
          cart: this.state.cart,
          loadingCart: this.state.loadingCart,
          addToCart: this.addToCart,
          removeFromCart: this.removeFromCart,
          fetchCart: this.fetchCart,
          clearCart: this.clearCart,
          updateCartItem: this.updateCartItem,
          selectedOptions: this.state.selectedOptions,
          setSelectedOptions: this.setSelectedOptions,
          setSuccessCart: this.setSuccessCart,
          setSuccessCheckout: this.setSuccessCheckout,
          closeSuccessCart: this.closeSuccessCart,
          closeSuccessCheckoutCart: this.closeSuccessCheckoutCart,
          successCart: this.state.successCart,
          cartItem: this.state.cartItem,
          successCheckout: this.state.successCheckout,
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }

  state: Readonly<CartContextState> = {
    cart: null,
    cartItem: null,
    loadingCart: false,
    selectedOptions: {
      color: "",
      size: "",
      quantity: 1,
      selectedImage: null,
    },
    successCart: false,
    successCheckout: false,
  };

  private tokenInterval: ReturnType<typeof setTimeout>;
  private addToCartTimeout?: ReturnType<typeof setTimeout>;
  private successTimeout?: ReturnType<typeof setTimeout>;
  private successCheckoutTimeout?: ReturnType<typeof setTimeout>;

  private getHeaders(): Record<string, string> {
    const token = Cookies.getCookie("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async executeWithLoading<T>(
    action: () => Promise<T>,
    errorMessage?: string
  ): Promise<T> {
    this.setState({ loadingCart: true });
    try {
      return await action();
    } catch (error) {
      console.error(errorMessage || "Ошибка:", error);
      throw error;
    } finally {
      this.setState({ loadingCart: false });
    }
  }

  componentDidMount() {
    this.checkTokenAndUpdate();
    this.tokenInterval = setInterval(this.checkTokenAndUpdate, 2000);
  }

  checkTokenAndUpdate = async () => {
    const token = Cookies.getCookie("token");
    if (!token && this.state.cart !== null) {
      this.clearCart();
    } else if (token && this.state.cart === null) {
      await this.fetchCart();
    }
  };

  fetchCart = async () => {
    await this.executeWithLoading(
      async () => {
        const response = await fetch(`${origin}/orders/cart/`, {
          method: "GET",
          headers: this.getHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        const data: CartData = await response.json();
        this.setState({ cart: data });
      },
      "Не получилось загрузить корзину:"
    );
  };

  addToCart = async (payload: AddToCartPayload) => {
    if (this.addToCartTimeout) { return; }

    this.addToCartTimeout = setTimeout(() => {
      this.addToCartTimeout = undefined;
    }, 1000);

    try {
      await this.executeWithLoading(async () => {
        const response = await fetch(`${origin}/orders/cart/items/`, {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        await this.fetchCart();
      }, "Не получилось добавить в корзину");
    } catch (error) {
      console.error("Ошибка при добавлении корзину:", error);
    }
  };

  removeFromCart = async (cartItemId: number) => {
    await this.executeWithLoading(
      async () => {
        const response = await fetch(`${origin}/orders/cart/items/${cartItemId}/`, {
          method: "DELETE",
          headers: this.getHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        await this.fetchCart();
      },
      "Не получилось удалить с корзины:"
    );
  };

  setSuccessCart = (successCart: boolean, product?: ClothItem | null, quantity?: number) => {
    const cartItem = product ? { id: product.id, product, quantity } : null;

    this.successTimeout && clearTimeout(this.successTimeout);
    this.setState({ successCart, cartItem });
    this.successTimeout = setTimeout(() => {
      this.setState({ successCart: false, cartItem: null });
      this.successTimeout = undefined;
    }, 3000);
  };

  setSuccessCheckout = (successCheckout: boolean) => {
    this.successCheckoutTimeout && clearTimeout(this.successTimeout);
    this.setState({ successCheckout });
    this.successCheckoutTimeout = setTimeout(() => {
      this.setState({ successCheckout: false });
      this.successCheckoutTimeout = undefined;
    }, 3000);
  }

  closeSuccessCart = () => {
    this.setState({ successCart: false });
  }

  closeSuccessCheckoutCart = () => {
    this.setState({ successCheckout: false });
  }

  componentWillUnmount() {
    this.tokenInterval && clearInterval(this.tokenInterval);
    this.successTimeout && clearTimeout(this.successTimeout);
    this.addToCartTimeout && clearTimeout(this.addToCartTimeout);
    this.successCheckoutTimeout && clearTimeout(this.successCheckoutTimeout);
  }

  updateCartItem = async (cartItemId: number, quantity: number) => {
    await this.executeWithLoading(
      async () => {
        const response = await fetch(`${origin}/orders/cart/items/${cartItemId}/`, {
          method: "PATCH",
          headers: this.getHeaders(),
          body: JSON.stringify({ quantity }),
        });
        if (!response.ok) {
          throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }
        await this.fetchCart();
      },
      "Не получилось обновить корзину:"
    );
  };

  clearCart = (): void => {
    this.setState({ cart: null });
  };

  setSelectedOptions = (options: Partial<SelectedOptions>) => {
    this.setState((prevState) => ({
      selectedOptions: { ...prevState.selectedOptions, ...options },
    }));
  };
}

export default CartContextProvider;
