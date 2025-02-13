import { PropsWithChildren, PureComponent } from "react";
import { CartContext } from "./ContextCollection";
import { ClothItem } from "./ClothesContext";
import axios from "axios";
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
  currentToken: string | null;
}

export interface CartContextActions extends Omit<CartContextState, 'currentToken'> {
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  clearCart: () => void;
  toggleCartItem: (productId: number) => Promise<void>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
}

function getUserIdFromToken(token: string): string {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.id ? String(payload.id) : "";
  } catch (error) {
    console.error("Error decoding token", error);
    return "";
  }
}

function getCartCookieKey(): string {
  const token = Cookies.getCookie("token");
  if (token) {
    const userId = getUserIdFromToken(token);
    return userId ? `cart_${userId}` : "cart";
  }
  return "cart";
}

const api = axios.create({
  baseURL: origin,
  headers: {
    "Content-Type": "application/json",
  }
});

api.interceptors.request.use((config) => {
  const token = Cookies.getCookie("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class CartContextProvider extends PureComponent<CartProviderProps, CartContextState> {
  state: Readonly<CartContextState> = {
    cart: null,
    loadingCart: false,
    currentToken: Cookies.getCookie("token"),
  };

  componentDidUpdate(prevProps: CartProviderProps, prevState: CartContextState) {
    const newToken = Cookies.getCookie("token");
    if (prevState.currentToken !== newToken) {
      this.setState({ currentToken: newToken });
      if (newToken) {
        this.fetchCart();
      } else {
        this.clearCart();
      }
    }
  }

  fetchCart = async () => {
    try {
      this.setState({ loadingCart: true });
      const response = await api.get("orders/cart/");
      // Ожидаем, что бэкенд возвращает объект корзины с summary-полями
      this.setState({ cart: response.data });
      Cookies.setCookie(getCartCookieKey(), JSON.stringify(response.data.cartItems), 1);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      this.setState({ loadingCart: false });
    }
  };

  addToCart = async (productId: number) => {
    try {
      this.setState({ loadingCart: true });
      await api.post("orders/cart/items/", { product_id: productId, quantity: 1 });
      await this.fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    } finally {
      this.setState({ loadingCart: false });
    }
  };

  removeFromCart = async (cartItemId: number) => {
    try {
      this.setState({ loadingCart: true });
      await api.delete(`orders/cart/items/${cartItemId}/`);
      await this.fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    } finally {
      this.setState({ loadingCart: false });
    }
  };

  toggleCartItem = async (productId: number) => {
    const cartItems = this.state.cart?.items || [];
    const existingItem = cartItems.find(item => item.product.id === productId);
    if (existingItem) {
      await this.removeFromCart(existingItem.id);
    } else {
      await this.addToCart(productId);
    }
  };

  updateCartItem = async (cartItemId: number, quantity: number) => {
    try {
      this.setState({ loadingCart: true });
      await api.patch(`orders/cart/items/${cartItemId}/`, { quantity });
      await this.fetchCart();
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    } finally {
      this.setState({ loadingCart: false });
    }
  };

  clearCart = (): void => {
    this.setState({ cart: null }, () => Cookies.deleteCookie(getCartCookieKey()));
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
