import { PropsWithChildren, PureComponent } from "react";
import { WishlistContext } from "./ContextCollection";
import { ClothItem } from "./ClothesContext";
import { origin } from "../../../project.config.json";
import Cookies from "utils/modules/Cookies";

export interface WishlistProviderProps extends PropsWithChildren {}

export interface WishlistItem {
  id: number;
  product: ClothItem;
}

export interface WishlistContextState {
  wishlistItems: WishlistItem[];
  loadingWishlist: boolean;
}

export interface WishlistContextActions extends WishlistContextState {
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (wishlistItemId: number) => Promise<void>;
  fetchWishlist: () => Promise<void>;
  clearWishlist: () => void;
}

class WishlistContextProvider extends PureComponent<WishlistProviderProps, WishlistContextState> {
  state: Readonly<WishlistContextState> = {
    wishlistItems: [],
    loadingWishlist: false,
  };

  private intervalId: NodeJS.Timeout | null = null;
  private previousToken: string | null = null;

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
    this.setState({ loadingWishlist: true });
    try {
      return await action();
    } catch (error) {
      console.error(errorMessage || "Error:", error);
      throw error;
    } finally {
      this.setState({ loadingWishlist: false });
    }
  }

  componentDidMount() {
    this.previousToken = Cookies.getCookie("token");
    this.checkTokenAndUpdate();
    this.intervalId = setInterval(() => {
      const currentToken = Cookies.getCookie("token");
      if (currentToken !== this.previousToken) {
        this.previousToken = currentToken;
        this.checkTokenAndUpdate();
      }
    }, 2000);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  checkTokenAndUpdate = async () => {
    const token = Cookies.getCookie("token");
    if (!token) {
      this.clearWishlist();
    } else {
      await this.fetchWishlist();
    }
  };

  fetchWishlist = async () => {
    await this.executeWithLoading(
      async () => {
        const response = await fetch(`${origin}/orders/wishlist/`, {
          method: "GET",
          headers: this.getHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.setState({ wishlistItems: data });
      },
      "Error fetching wishlist:"
    );
  };

  addToWishlist = async (productId: number) => {
    await this.executeWithLoading(
      async () => {
        const response = await fetch(`${origin}/orders/wishlist/`, {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({ product_id: productId }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await this.fetchWishlist();
      },
      "Error adding to wishlist:"
    );
  };

  removeFromWishlist = async (wishlistItemId: number) => {
    await this.executeWithLoading(
      async () => {
        const response = await fetch(`${origin}/orders/wishlist/${wishlistItemId}/`, {
          method: "DELETE",
          headers: this.getHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Remove the item locally.
        this.setState((prevState) => ({
          wishlistItems: prevState.wishlistItems.filter(item => item.id !== wishlistItemId),
        }));
      },
      "Error removing from wishlist:"
    );
  };

  clearWishlist = (): void => {
    this.setState({ wishlistItems: [] });
  };

  render() {
    return (
      <WishlistContext.Provider
        value={{
          wishlistItems: this.state.wishlistItems,
          loadingWishlist: this.state.loadingWishlist,
          addToWishlist: this.addToWishlist,
          removeFromWishlist: this.removeFromWishlist,
          fetchWishlist: this.fetchWishlist,
          clearWishlist: this.clearWishlist,
        }}
      >
        {this.props.children}
      </WishlistContext.Provider>
    );
  }
}

export default WishlistContextProvider;
