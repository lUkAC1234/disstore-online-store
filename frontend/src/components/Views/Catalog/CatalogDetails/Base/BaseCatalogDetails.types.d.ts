declare global {
    interface BaseCatalogDetailsProps {
        data: ClothItem;
        setData: (data: ClothItem) => void;
        error: boolean
        setSelectedOptions: (options: Partial<SelectedOptions>) => void;
        cart: CartData | null;
        selectedOptions: SelectedOptions;
        addToCart: (payload: AddToCartPayload) => Promise<void>;
    }
    interface BaseCatalogDetailsState { }
}

export { }