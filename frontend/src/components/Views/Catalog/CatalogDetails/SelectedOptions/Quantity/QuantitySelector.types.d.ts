import { WithTranslation } from "react-i18next";

declare global {
    interface SelectedOptionsQuantity {
        quantity: number;
    }
    
    interface QuantitySelectorProps extends WithTranslation {
        data: ClothItem;
        maxAvailable: number;
        globalQuantity: number;
        positionStatic?: boolean
        addToCart: (id: string | number) => void;
        selectedOptions: SelectedOptionsQuantity;
        handleOptionChange: (option: string, value: string | number) => void;
        isAuthenticated: boolean;
        addToWishList?: (productId: number) => Promise<void>;
        removeFromWishlist?: (wishlistItemId: number) => Promise<void>;
        wishlistItems?: WishlistItem[];
        toggleModal: (callback: () => void) => void;
        setModalChildren: (children: ReactNode) => void;
        isModalActive: boolean;
        modalChildren: ReactNode;

        setSuccessCart: (success: boolean, product?: ClothItem | null, quantity?: number) => void;
    }
    interface QuantitySelectorState {
        pathname: string;
    }
}

export { }