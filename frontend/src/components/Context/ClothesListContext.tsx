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
}

export interface ClothesListContextProps extends PropsWithChildren {}

type ResponseTypeClothesFilter = {
    next: string | null;
    previous: string | null;
    count: number;
    results: ClothItem[];
    price_min: number;
    price_max: number;
}

export interface ClothesListActions extends ClothesListContextState {
    setProducts: (products: ClothItem[]) => void;
    setTypes: (type: Clothestypes[]) => void;
    setColors: (colors: Color[]) => void;
    setSizes: (sizes: Size[]) => void;
    setLoadingProducts: (setLoadingProducts: boolean) => void;
    setSelectedMin: (value: number) => void;
    setSelectedMax: (value: number) => void;
    setCurrentPage: (value: number) => void;
    setNextPage: (value: string) => void;
    setPrevPage: (value: string) => void;
    setTotalPages: (value: number) => void;
    setCount: (value: number) => void;
    setMin: (value: number) => void;
    setMax: (value: number) => void;
    fetchFilteredProducts: () => Promise<void>;
    setSelectedPriceMinMax: (values: number[]) => void;
    handleFilterSelection: (field: "selectedSizes" | "selectedTypes" | "selectedColors", id: number) => void;
    setSelectedTypes: (values: number[], callback?: () => void) => void;
    debouncedFetchFilteredProducts: () => Promise<void>;
}

class ClothesListProvider extends PureComponent<ClothesListContextProps, ClothesListContextState> {
    state: Readonly<ClothesListContextState> = {
        loading: false,
        loadingProducts: false,
        error: false,
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
                    setCurrentPage: this.setCurrentPage,
                    setNextPage: this.setNextPage,
                    setPrevPage: this.setPrevPage,
                    setTotalPages: this.setTotalPages,
                    setCount: this.setCount,
                    setMin: this.setMin,
                    setMax: this.setMax,
                    fetchFilteredProducts: this.fetchFilteredProducts,
                    setSelectedPriceMinMax: this.setSelectedPriceMinMax,
                    handleFilterSelection: this.handleFilterSelection,
                    setSelectedTypes: this.setSelectedTypes,
                    debouncedFetchFilteredProducts: this.debouncedFetchFilteredProducts,
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

            const response = await fetch(`${origin}/clothes/?page=${this.state.currentPage}`);
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
            } = this.state;

            const generateQueryString = <T extends { id: number }>(
                selectedItems: number[],
                allItems: T[],
                queryKey: string
            ): string => {
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

            const queryString = [colorQuery, typeQuery, sizeQuery, priceQuery]
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
            }: ResponseTypeClothesFilter = await response.json();

            this.setState(prevState => {

                return {
                    ...prevState,
                    nextPage: next,
                    prevPage: previous,
                    count,
                    products: results,
                };
            });


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

    setCurrentPage = (value: number): void => {
        this.setState((prevState) => ({
            ...prevState,
            currentPage: value,
        }));
    };

    setNextPage = (value: string): void => {
        this.setState((prevState) => ({
            ...prevState,
            nextPage: value,
        }));
    };

    setPrevPage = (value: string): void => {
        this.setState((prevState) => ({
            ...prevState,
            prevPage: value,
        }));
    };

    setTotalPages = (value: number): void => {
        this.setState((prevState) => ({
            ...prevState,
            totalPages: value,
        }));
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
