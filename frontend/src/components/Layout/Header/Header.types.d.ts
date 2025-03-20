import { WithTranslation } from "react-i18next";
import { WithRouterProps } from "../../../Hocs/withRouter";

declare global {
    interface HeaderProps extends WithTranslation, WithRouterProps {
        resetFilters: () => void;
        loading: boolean;
        error: boolean;
        products: ClothItem[];
        type: Clothestypes[];
        setApplyFilters: () => void;
        setSelectedTypes: (values: number[], callback?: () => void) => void;
        isAuthenticated: boolean;
        wishlistItems: WishlistItem[];
        cart: CartData | null;
    }

    interface HeaderState {
        activeLink: string | null;
        title: string;
        searchResults: ClothItem[];
        searchLoading: boolean;
        searchError: string | null;
        isMobile: boolean;
        linksMobileIsOpen: boolean;
    }
}

export { }