import { PureComponent, ReactNode, PropsWithChildren } from "react";
import { UserContext } from "./ContextCollection";
import Cookies from "utils/modules/Cookies";

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

export interface UserContextActions extends UserContextState {
  setLogin: (token: string, user: UserData) => void;
  setLogout: () => void;
}

class UserContextProvider extends PureComponent<PropsWithChildren, UserContextState> {
  state: UserContextState = {
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

  render(): ReactNode {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          setLogin: this.setLogin,
          setLogout: this.setLogout,
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserContextProvider;
