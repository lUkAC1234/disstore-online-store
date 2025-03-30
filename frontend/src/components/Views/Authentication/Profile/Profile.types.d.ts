import { WithTranslation } from "react-i18next";

declare global {
  interface ProfileProps extends WithTranslation {
    smallVersion?: boolean;
    isAuthenticated: boolean;
    user: UserData;
    updateUser: (data: Partial<UserData>) => Promise<void>;
    setLogout: () => void;
  }
  type EditableProfileFields = Pick<ProfileState, "first_name" | "last_name" | "mobile_number">;
  interface ProfileState {
    first_name: string;
    last_name: string;
    mobile_number: string;
    modalField: keyof EditableProfileFields | null;
    modalValue: string;
  }
}

export { }