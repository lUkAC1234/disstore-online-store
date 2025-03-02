import { WithTranslation } from "react-i18next";

declare global {
  interface AuthenticationProps extends WithTranslation {
    smallVersion?: boolean;
    setLogin: (token: string, user: UserData) => void;
    isAuthenticated: boolean;
  }
  interface AuthenticationState {
    isLoginView: boolean;
    otpMode: boolean;
    otpEmail: string;
    otpPurpose: "login" | "registration";
    otpPassword?: string;
  }
}

export { }