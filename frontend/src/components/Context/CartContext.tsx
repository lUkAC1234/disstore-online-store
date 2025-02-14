import { PropsWithChildren, PureComponent } from "react";
import { CartContext } from "./ContextCollection";
import { ClothItem } from "./ClothesContext";
import { origin } from "../../../project.config.json";
import Cookies from "utils/modules/Cookies";

export interface CartProviderProps extends PropsWithChildren {}

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

export interface CartContextState {
  cart: CartData | null;
  loadingCart: boolean;
}

export interface CartContextActions {
  cart: CartData | null;
  loadingCart: boolean;
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  clearCart: () => void;
  toggleCartItem: (productId: number) => Promise<void>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
}

class CartContextProvider extends PureComponent<CartProviderProps, CartContextState> {
  state: Readonly<CartContextState> = {
    cart: null,
    loadingCart: false,
  };

  private tokenInterval: NodeJS.Timeout | null = null;

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
      console.error(errorMessage || "Error:", error);
      throw error;
    } finally {
      this.setState({ loadingCart: false });
    }
  }

  componentDidMount() {
    this.checkTokenAndUpdate();
    this.tokenInterval = setInterval(this.checkTokenAndUpdate, 2000);
  }

  componentWillUnmount() {
    if (this.tokenInterval) {
      clearInterval(this.tokenInterval);
    }
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: CartData = await response.json();
        this.setState({ cart: data });
      },
      "Error fetching cart:"
    );
  };

  addToCart = async (productId: number) => {
    await this.executeWithLoading(
      async () => {
        const response = await fetch(`${origin}/orders/cart/items/`, {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({ product_id: productId, quantity: 1 }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await this.fetchCart();
      },
      "Error adding to cart:"
    );
  };

  removeFromCart = async (cartItemId: number) => {
    await this.executeWithLoading(
      async () => {
        const response = await fetch(`${origin}/orders/cart/items/${cartItemId}/`, {
          method: "DELETE",
          headers: this.getHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await this.fetchCart();
      },
      "Error removing from cart:"
    );
  };

  toggleCartItem = async (productId: number) => {
    const items = this.state.cart?.items || [];
    const existingItem = items.find((item) => item.product.id === productId);
    if (existingItem) {
      await this.removeFromCart(existingItem.id);
    } else {
      await this.addToCart(productId);
    }
  };

  updateCartItem = async (cartItemId: number, quantity: number) => {
    await this.executeWithLoading(
      async () => {
        const response = await fetch(`${origin}/orders/cart/items/${cartItemId}/`, {
          method: "PATCH",
          headers: this.getHeaders(),
          body: JSON.stringify({ quantity }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await this.fetchCart();
      },
      "Error updating cart item:"
    );
  };

  clearCart = (): void => {
    this.setState({ cart: null });
  };

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
          toggleCartItem: this.toggleCartItem,
          updateCartItem: this.updateCartItem,
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }
}

export default CartContextProvider;
