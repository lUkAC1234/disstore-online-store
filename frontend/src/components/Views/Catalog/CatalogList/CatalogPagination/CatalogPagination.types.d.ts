declare global {
    interface CatalogPaginationState {
    }

    interface CatalogPaginationProps {
        currentPage: number;
        totalPages: number;
        handlePrevPage?: () => void;
        handleNextPage?: () => void;
    }
}

export { }
