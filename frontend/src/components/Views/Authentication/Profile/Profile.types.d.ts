import { WithTranslation } from "react-i18next";

declare global {
  interface ProfileProps extends WithTranslation{
    smallVersion?: boolean; 
    isAuthenticated: boolean;
    user: UserData;
    setLogout: () => void;
  }
  interface ProfileState {}
}

export {}