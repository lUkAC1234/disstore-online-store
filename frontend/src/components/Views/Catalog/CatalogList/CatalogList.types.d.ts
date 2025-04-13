declare global {
    interface CatalogListState {
        isFilterActive: boolean;
    }
    
    interface CatalogListProps {
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
