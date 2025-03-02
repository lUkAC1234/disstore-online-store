declare global {
    interface CatalogFiltersState {
        activeColors: boolean;
        activeSizes: boolean;
    }

    interface CatalogFiltersProps {
        isFilterActive: boolean;
        toggleFilter: () => void;
        catalogFiltersContainerRef: RefObject<HTMLDivElement>;
        type: Clothestypes[];
        colors: Color[];
        sizes: Size[];
        selectedSizes: number[];
        selectedTypes: number[];
        selectedColors: number[];
        selectedMin: number;
        selectedMax: number;
        min: number;
        max: number;
        handleFilterSelection: (field: "selectedSizes" | "selectedTypes" | "selectedColors", id: number) => void;
        setSelectedMin: (value: number) => void;
        setSelectedMax: (value: number) => void;
        setSelectedPriceMinMax: (values: number[]) => void;
        setApplyFilters: () => void;
    }
}

export { }
