import { PropsWithChildren, PureComponent } from "react";
import { ClothesListContext } from "./ContextCollection";
import { Clothestypes, ClothItem, Size, Color } from "./ClothesContext";
import { origin } from "../../../project.config.json";
import { debounce } from "utils/hooks/debounce";

export interface ClothesListContextState {
    products: ClothItem[];
    sizes: Size[];
    type: Clothestypes[];
    selectedSizes: number[];
    selectedTypes: number[];
    selectedColors: number[];
    selectedMin: number;
    selectedMax: number;
    currentPage: number;
    nextPage: string | null;
    prevPage: string | null;
    totalPages: number;
    count: number;
    colors: Color[];
    loading: boolean;
    loadingProducts: boolean;
    error: boolean;
    min: number;
    max: number;
    filtersApplied: boolean;
    title: string;
}

export interface ClothesListContextProps extends PropsWithChildren { }

type ResponseTypeClothesFilter = {
    next: string | null;
    previous: string | null;
    count: number;
    results: ClothItem[];
    price_min: number;
    price_max: number;
    total_pages: number;
    current_page: number;
}

export interface ClothesListActions extends ClothesListContextState {
    setProducts: (products: ClothItem[]) => void;
    setTypes: (type: Clothestypes[]) => void;
    setColors: (colors: Color[]) => void;
    setSizes: (sizes: Size[]) => void;
    setLoadingProducts: (setLoadingProducts: boolean) => void;
    setSelectedMin: (value: number) => void;
    setSelectedMax: (value: number) => void;
    setNextPage: () => void;
    setPrevPage: () => void;
    setCount: (value: number) => void;
    setMin: (value: number) => void;
    setMax: (value: number) => void;
    fetchFilteredProducts: () => Promise<void>;
    setSelectedPriceMinMax: (values: number[]) => void;
    handleFilterSelection: (field: "selectedSizes" | "selectedTypes" | "selectedColors", id: number) => void;
    setSelectedTypes: (values: number[], callback?: () => void) => void;
    debouncedFetchFilteredProducts: () => Promise<void>;
    resetFilters: () => void;
    setApplyFilters: () => void;
    setTitle: (value: string) => void;
}

class ClothesListProvider extends PureComponent<ClothesListContextProps, ClothesListContextState> {
    state: Readonly<ClothesListContextState> = {
        loading: false,
        loadingProducts: false,
        error: false,
        filtersApplied: false,
        products: [],
        selectedSizes: [],
        selectedTypes: [],
        selectedColors: [],
        sizes: [],
        type: [],
        colors: [],
        min: 0,
        max: 0,
        selectedMin: 0,
        selectedMax: 0,
        currentPage: 1,
        nextPage: null,
        prevPage: null,
        totalPages: 1,
        count: 0,
        title: "",
    };

    render() {
        return (
            <ClothesListContext.Provider
                value={{
                    ...this.state,
                    setProducts: this.setProducts,
                    setTypes: this.setTypes,
                    setColors: this.setColors,
                    setSizes: this.setSizes,
                    setLoadingProducts: this.setLoadingProducts,
                    setSelectedMin: this.setSelectedMin,
                    setSelectedMax: this.setSelectedMax,
                    setNextPage: this.setNextPage,
                    setPrevPage: this.setPrevPage,
                    setCount: this.setCount,
                    setMin: this.setMin,
                    setMax: this.setMax,
                    fetchFilteredProducts: this.fetchFilteredProducts,
                    setSelectedPriceMinMax: this.setSelectedPriceMinMax,
                    handleFilterSelection: this.handleFilterSelection,
                    setSelectedTypes: this.setSelectedTypes,
                    debouncedFetchFilteredProducts: this.debouncedFetchFilteredProducts,
                    resetFilters: this.resetFilters,
                    setApplyFilters: this.setApplyFilters,
                    setTitle: this.setTitle,
                }}
            >
                {this.props.children}
            </ClothesListContext.Provider>
        );
    }

    async componentDidMount() {
        await this.fetchFilters();
        await this.fetchProducts();
    }

    fetchProducts = async (): Promise<void> => {
        try {
            this.setLoadingState(true);

            const response = await fetch(`${origin}/clothes/`);
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await response.json();
            this.setProducts(data.results);
            this.setState((prevState) => ({
                ...prevState,
                min: data.price_min,
                max: data.price_max,
                selectedMin: data.price_min,
                selectedMax: data.price_max,
                totalPages: data.total_pages,
                currentPage: data.current_page,
                count: data.count,
                nextPage: data.next,
                prevPage: data.previous,
            }), async () => {
                const cachedProducts = sessionStorage.getItem("c");
                if (cachedProducts) {
                    this.setProducts(JSON.parse(cachedProducts));
                } else {
                    await this.fetchFilteredProducts();
                }
            });
        } catch (error) {
            this.setErrorState();
        } finally {
            this.setLoadingState(false);
        }
    };



    setSelectedPriceMinMax = (values: number[]): void => {
        this.setState(prevState => ({
            ...prevState,
            selectedMin: values[0],
            selectedMax: values[1],
        }));
    }

    setSelectedTypes = (values: number[], callback?: () => void): void => {
        this.setState(prevState => ({
            ...prevState,
            selectedTypes: [...values],
        }), () => callback());
    }

    fetchFilters = async (): Promise<void> => {
        const cachedSizes = sessionStorage.getItem("sizes");
        const cachedTypes = sessionStorage.getItem("types");
        const cachedColors = sessionStorage.getItem("colors");

        if (cachedSizes && cachedTypes && cachedColors) {
            this.setState(prevState => ({
                ...prevState,
                sizes: JSON.parse(cachedSizes),
                type: JSON.parse(cachedTypes),
                colors: JSON.parse(cachedColors),
            }));
        }

        const [sizesData, typeData, colorsData] = await Promise.all([
            fetch(`${origin}/clothes/sizes/`).then((res) => res.json()),
            fetch(`${origin}/clothes/types/`).then((res) => res.json()),
            fetch(`${origin}/clothes/colors/`).then((res) => res.json()),
        ]);

        sessionStorage.setItem("sizes", JSON.stringify(sizesData));
        sessionStorage.setItem("types", JSON.stringify(typeData));
        sessionStorage.setItem("colors", JSON.stringify(colorsData));

        this.setState(prevState => ({
            ...prevState,
            sizes: sizesData,
            type: typeData,
            colors: colorsData,
        }));
    };

    debouncedFetchFilteredProducts = debounce(async () => await this.fetchFilteredProducts(), 250);

    fetchFilteredProducts = async (): Promise<void> => {
        if (!this.state.filtersApplied) { return; }
        try {
            const {
                selectedColors,
                selectedSizes,
                selectedTypes,
                colors,
                sizes,
                type: types,
                selectedMin: min,
                selectedMax: max,
                currentPage: page,
                title,
            } = this.state;

            const generateQueryString = <T extends { id: number }>(selectedItems: number[], allItems: T[], queryKey: string): string => {
                const itemMap = new Map(allItems.map((item) => [item.id, item]));
                return selectedItems
                    .filter((id) => itemMap.has(id))
                    .map((id) => `${queryKey}=${id}`)
                    .join("&");
            };

            const colorQuery = generateQueryString(selectedColors, colors, "color");
            const sizeQuery = generateQueryString(selectedSizes, sizes, "size");
            const typeQuery = generateQueryString(selectedTypes, types, "types");
            const priceQuery = `price_min=${min}&price_max=${max}`;
            const titleQuery = `title=${encodeURIComponent(title)}`
            const queryString = [colorQuery, typeQuery, sizeQuery, priceQuery, titleQuery]
                .filter(Boolean)
                .join("&");

            const url = `${origin}/clothes/?page=${page}&${queryString}`;

            const response: Response = await fetch(url);
            if (!response.ok) {
                throw new Error("Не получилось загрузить данные");
            }

            const {
                next,
                previous,
                count,
                results,
                total_pages,
                current_page,
            }: ResponseTypeClothesFilter = await response.json();

            this.setState(prevState => ({
                ...prevState,
                nextPage: next,
                prevPage: previous,
                count,
                products: results,
                totalPages: total_pages,
                currentPage: current_page,
            }));

        } catch (err) {
            this.setErrorState();
            console.error(err);
        } finally {
            this.setLoadingState(false);
        }

    };


    handleFilterSelection = (field: "selectedSizes" | "selectedTypes" | "selectedColors", id: number) => {
        this.setState((prevState) => {
            const isSelected = prevState[field].includes(id);
            return {
                ...prevState,
                [field]: isSelected
                    ? prevState[field].filter(item => item !== id)
                    : [...prevState[field], id],
            };
        });
    };

    resetFilters = () => {
        this.setState(
            {
                selectedSizes: [],
                selectedTypes: [],
                selectedColors: [],
                selectedMin: this.state.min,
                selectedMax: this.state.max,
                title: "",
            },
            this.debouncedFetchFilteredProducts
        );
    };

    setErrorState = (): void => {
        this.setState((prevState) => ({
            ...prevState,
            error: true,
            loading: false,
        }));
    };

    setLoadingState = (value: boolean): void => {
        this.setState((prevState) => ({
            ...prevState,
            loading: value,
        }));
    };

    setLoadingProducts = (value: boolean): void => {
        this.setState((prevState) => ({
            ...prevState,
            loadingProducts: value,
        }));
    };

    setApplyFilters = (): void => {
        this.setState({ filtersApplied: true }, () => { this.debouncedFetchFilteredProducts(); });
    };

    setTypes = (type: Clothestypes[]): void => {
        this.setState((prevState) => ({
            ...prevState,
            type,
        }));
    };

    setColors = (colors: Color[]): void => {
        this.setState((prevState) => ({
            ...prevState,
            colors,
        }));
    };

    setSizes = (sizes: Size[]): void => {
        this.setState((prevState) => ({
            ...prevState,
            sizes,
        }));
    };

    setProducts = (products: ClothItem[]): void => {
        this.setState((prevState) => ({
            ...prevState,
            products,
            loading: false,
        }));
    };

    setSelectedMin = (value: number): void => {
        this.setState((prevState) => ({
            ...prevState,
            selectedMin: value,
        }));
    };

    setSelectedMax = (value: number): void => {
        this.setState((prevState) => ({
            ...prevState,
            selectedMax: value,
        }));
    };

    setTitle = (value: string): void => {
        this.setState((prevState) => ({
            ...prevState,
            title: value,
        }));
    }

    setNextPage = (): void => {
        if (this.state.currentPage < this.state.totalPages) {
            this.setState((prevstate) => ({
                ...prevstate,
                currentPage: prevstate.currentPage + 1
            }), () => this.setApplyFilters());
        }
    };

    setPrevPage = (): void => {
        if (this.state.currentPage > 1) {
            this.setState((prevstate) => ({
                ...prevstate,
                currentPage: prevstate.currentPage - 1
            }), () => this.setApplyFilters());
        }
    };

    setCount = (value: number): void => {
        this.setState((prevState) => ({
            ...prevState,
            count: value,
        }));
    };

    setMin = (value: number): void => {
        this.setState((prevState) => ({
            ...prevState,
            min: value,
        }));
    };

    setMax = (value: number): void => {
        this.setState((prevState) => ({
            ...prevState,
            max: value,
        }));
    };
}

export default ClothesListProvider;
