import { CartItem } from "components/Context/CartContext";
import { WithTranslation } from "react-i18next";

declare global {
  interface ExtendedCartItemProps extends CartItem {
    selected_color?: string;
    selected_size?: string;
    selected_image?: string;
  }
  
  interface CartProps extends WithTranslation {
    cart: CartData | null;
    removeFromCart: (cartItemId: number) => Promise<void>;
    updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
  }

  interface CartState {}
}

export {}