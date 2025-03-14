declare global {
  interface MessagesProps {
    successCart: boolean;
    successCheckout: boolean;
    cartItem: CartItem;
    closeSuccessCart: () => void;
    closeSuccessCheckoutCart: () => void;
  }
  interface MessagesState {}
}

export {}