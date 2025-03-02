declare global {
  interface CatalogItemProps {
    item: ClothItem;
    lang: string;
    isInWishlist?: boolean;
    onWishlistClick?: (item: ClothItem) => void;
    onCartClick?: (item: ClothItem) => void;
  }
  interface CatalogItemState { }
}

export { }