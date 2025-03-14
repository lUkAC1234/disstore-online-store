import { CartItem } from "components/Context/CartContext";
import { WithTranslation } from "react-i18next";

declare global {
  interface CheckoutProps extends WithTranslation {
    cart: CartData | null;
    clearCart: () => void;
    setSuccessCheckout: (success: boolean) => void;
    user: UserData
  }
  interface CheckoutState {
    fullName: string;
    address: string;
    phone: string;
    email: string;
    processing: boolean;
    error: string | null;
    success: boolean;
    onPhoneChange: (evt: ChangeEvent<HTMLInputElement>) => void;
    rawDigits: string;
  }
  interface ExtendedCartItem extends CartItem {
    selected_color?: string;
    selected_size?: string;
    selected_image?: string;
  }
}

export { }