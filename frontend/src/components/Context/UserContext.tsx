import { PureComponent, ReactNode, PropsWithChildren } from "react";
import { UserContext } from "./ContextCollection";
import Cookies from "utils/modules/Cookies";
import { origin } from "../../../project.config.json";

export interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
}

export interface UserContextState {
  token: string | null;
  user: UserData | null;
  isAuthenticated: boolean;
}

export interface TokenData {
  access: string;
  user: UserData;
}

export interface UserContextActions extends UserContextState {
  setLogin: (token: string, user: UserData) => void;
  setLogout: () => void;
  updateUser: (data: Partial<UserData>) => Promise<void>;
}

class UserContextProvider extends PureComponent<PropsWithChildren, UserContextState> {
  state: Readonly<UserContextState> = {
    token: Cookies.getCookie("token") || null,
    user: Cookies.getCookie("user") ? JSON.parse(Cookies.getCookie("user")!) : null,
    isAuthenticated: !!Cookies.getCookie("token"),
  };

  componentDidMount() {
    const token = Cookies.getCookie("token");
    const userCookie = Cookies.getCookie("user");
    if (token && userCookie) {
      const user: UserData = JSON.parse(userCookie);
      this.setState({ token, user, isAuthenticated: true });
    }
  }

  setLogin = (token: string, user: UserData): void => {
    Cookies.setCookie("token", token, 7);
    Cookies.setCookie("user", JSON.stringify(user), 7);
    this.setState({ token, user, isAuthenticated: true });
  };

  setLogout = (): void => {
    Cookies.deleteCookie("token");
    Cookies.deleteCookie("user");
    this.setState({ token: null, user: null, isAuthenticated: false });
  };

  updateUser = async (data: Partial<UserData>): Promise<void> => {
    try {
      const token = this.state.token;
      if (!token) {
        throw new Error("User is not authenticated");
      }
      const response = await fetch(`${origin}/auth/users/me/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const updatedUser = { ...this.state.user, ...result.user };
      Cookies.setCookie("user", JSON.stringify(updatedUser), 7);
      this.setState({ user: updatedUser });
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  };

  render(): ReactNode {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          setLogin: this.setLogin,
          setLogout: this.setLogout,
          updateUser: this.updateUser,
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserContextProvider;
