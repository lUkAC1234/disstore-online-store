import { WithTranslation } from "react-i18next"; 

declare global {
    interface CatalogProductsState {
        pathname: string
    }
    
    interface CatalogProductsProps extends WithTranslation {
        products: ClothItem[];
          wishlistItems?: WishlistItem[];
          addToWishList?: (productId: number) => Promise<void>;
          removeFromWishlist?: (wishlistItemId: number) => Promise<void>;
          loadingWishlist?: boolean;
          toggleModal: (callback: () => void) => void;
          setModalChildren: (children: ReactNode) => void;
          isModalActive: boolean;
          modalChildren: ReactNode;
          isAuthenticated: boolean;
    }
}

export { }
