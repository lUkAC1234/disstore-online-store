declare global {
  interface WishListProps {
    toggleModal: (callback: () => void) => void;
    setModalChildren: (children: ReactNode) => void;
    isModalActive: boolean;
    modalChildren: ReactNode;
    wishlistItems: WishlistItem[];
    removeFromWishlist: (wishlistItemId: number) => Promise<void>;
  }
  interface WishListState {
    pathname: location.pathname,
  }
}

export { }