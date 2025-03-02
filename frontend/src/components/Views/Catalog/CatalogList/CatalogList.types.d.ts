import { WithTranslation } from "react-i18next"; 

declare global {
    interface CatalogListState {
        isFilterActive: boolean;
    }
    
    interface CatalogListProps extends WithTranslation {
        loading: boolean;
        error: boolean;
        products: ClothItem[];
        currentPage: number;
        totalPages: number;
        loadingProducts: boolean;
        resetFilters: () => void;
        setPrevPage: () => void;
        setNextPage: () => void;
    }
}

export { }
