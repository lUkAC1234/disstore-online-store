import { PropsWithChildren, PureComponent } from "react";
import { WishlistContext } from "./ContextCollection";
import { ClothItem } from "./ClothesContext";
import axios from "axios";
import { origin } from "../../../project.config.json";

export interface WishlistProviderProps extends PropsWithChildren { }

export interface WishlistItem {
    id: number;
    product: ClothItem;
}

export interface WishlistContextState {
    wishlistItems: WishlistItem[];
    loading: boolean;
}

export interface WishlistContextActions extends WishlistContextState {
    addToWishlist: (productId: number) => Promise<void>;
    removeFromWishlist: (wishlistItemId: number) => Promise<void>;
    fetchWishlist: () => Promise<void>;
}

const api = axios.create({
    baseURL: origin,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

class WishlistContextProvider extends PureComponent<WishlistProviderProps, WishlistContextState> {
    state: Readonly<WishlistContextState> = {
        wishlistItems: JSON.parse(localStorage.getItem("wishlist") || "[]"),
        loading: false,
    };

    fetchWishlist = async () => {
        try {
            this.setState({ loading: true });
            const response = await api.get('orders/wishlist/');
            this.setState({ wishlistItems: response.data });
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            this.setState({ loading: false });
        }
    };

    addToWishlist = async (productId: number) => {
        try {
            this.setState({ loading: true });
            await api.post('orders/wishlist/', { product_id: productId });
            await this.fetchWishlist();
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        } finally {
            this.setState({ loading: false });
        }
    };

    removeFromWishlist = async (wishlistItemId: number) => {
        try {
            this.setState({ loading: true });
            await api.delete(`orders/wishlist/${wishlistItemId}/`);
            this.setState(prev => ({
                wishlistItems: prev.wishlistItems.filter(item => item.id !== wishlistItemId)
            }));
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            throw error;
        } finally {
            this.setState({ loading: false });
        }
    };

    clearWishlist = (): void => {
        this.setState({ wishlistItems: [] }, () => localStorage.removeItem("wishlist"));
    };

    // async componentDidMount() {
    //     this.fetchWishlist();
    // }

    render() {
        return (
            <WishlistContext.Provider
                value={{
                    ...this.state,
                    addToWishlist: this.addToWishlist,
                    removeFromWishlist: this.removeFromWishlist,
                    fetchWishlist: this.fetchWishlist,
                }}
            >
                {this.props.children}
            </WishlistContext.Provider>
        );
    }
}

export default WishlistContextProvider;