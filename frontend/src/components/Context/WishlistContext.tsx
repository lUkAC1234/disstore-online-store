import { PropsWithChildren, PureComponent } from "react";
import { WishlistContext } from "./ContextCollection";
import { ClothItem } from "./ClothesContext";
import axios from "axios";
import { origin } from "../../../project.config.json";
import Cookies from "utils/modules/Cookies";

export interface WishlistProviderProps extends PropsWithChildren { }

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

const api = axios.create({
    baseURL: origin,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(config => {
    const token = Cookies.getCookie('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

class WishlistContextProvider extends PureComponent<WishlistProviderProps, WishlistContextState> {
    state: Readonly<WishlistContextState> = {
        wishlistItems: JSON.parse(Cookies.getCookie("wishlist") || "[]"),
        loadingWishlist: false,
    };

    fetchWishlist = async () => {
        try {
            this.setState(prevState => ({ ...prevState, loadingWishlist: true }));
            const response = await api.get('orders/wishlist/');
            this.setState(prevState => ({ ...prevState, wishlistItems: response.data }));
            Cookies.setCookie("wishlist", JSON.stringify(response.data), 1);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            this.setState(prevState => ({ ...prevState, loadingWishlist: false }));
        }
    };

    addToWishlist = async (productId: number) => {
        try {
            this.setState(prevState => ({ ...prevState, loadingWishlist: true }));
            await api.post('orders/wishlist/', { product_id: productId });
            await this.fetchWishlist();
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        } finally {
            this.setState(prevState => ({ ...prevState, loadingWishlist: false }));
        }
    };

    removeFromWishlist = async (wishlistItemId: number) => {
        try {
            this.setState(prevState => ({ ...prevState, loadingWishlist: true }));
            await api.delete(`orders/wishlist/${wishlistItemId}/`);
            this.setState(prev => {
                const updatedItems = prev.wishlistItems.filter(item => item.id !== wishlistItemId);
                Cookies.setCookie("wishlist", JSON.stringify(updatedItems), 1);
                return { ...prev, wishlistItems: updatedItems };
            });
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            throw error;
        } finally {
            this.setState(prevState => ({ ...prevState, loadingWishlist: false }));
        }
    };

    clearWishlist = (): void => {
        this.setState({ wishlistItems: [] }, () => Cookies.deleteCookie("wishlist"));
    };

    render() {
        return (
            <WishlistContext.Provider
                value={{
                    ...this.state,
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
