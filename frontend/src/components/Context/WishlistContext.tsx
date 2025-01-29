import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { WishlistContext } from "./ContextCollection";
import { ClothItem } from "./ClothesContext";

export interface WishlistProviderProps extends PropsWithChildren {}

export interface WishlistItem {
    id: number;
    product: ClothItem;
}

export interface WishlistContextState {
    wishlistItems: WishlistItem[];
    loading: boolean;
}

export interface WishlistContextActions extends WishlistContextState {
    addToWishlist: (product: ClothItem) => Promise<void>;
    removeFromWishlist: (productId: number) => Promise<void>;
    fetchWishlist: () => Promise<void>;
}

class WishlistContextProvider extends PureComponent<WishlistProviderProps, WishlistContextState> {
    state: Readonly<WishlistContextState> = {
        wishlistItems: [],
        loading: false,
    };

    render(): ReactNode {
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
        )
    }

    async componentDidMount() {
        await this.fetchWishlist();
    }

    fetchWishlist = async () => {
        this.setState({ loading: true });
        try {
            const response = await fetch('/api/wishlist/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                this.setState({ wishlistItems: data });
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            this.setState({ loading: false });
        }
    };

    addToWishlist = async (product: ClothItem) => {
        try {
            const response = await fetch('/api/wishlist/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product_id: product.id }),
            });

            if (response.ok) {
                await this.fetchWishlist();
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };

    removeFromWishlist = async (productId: number) => {
        try {
            const response = await fetch(`/api/wishlist/${productId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (response.ok) {
                this.setState(prev => ({
                    wishlistItems: prev.wishlistItems.filter(item => item.product.id !== productId)
                }));
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };
}

export default WishlistContextProvider;