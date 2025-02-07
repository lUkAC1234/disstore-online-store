import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { UserContext } from "./ContextCollection";
import Cookies from "utils/modules/Cookies";

export interface UserProviderProps extends PropsWithChildren {}

export interface UserContextState {
    token: string | null;
    email: string | null;
    isAuthenticated: boolean;
}

export interface UserContextActions extends UserContextState {
    setLogin: (token: string, email: string) => void;
    setLogout: () => void;
}

class UserContextProvider extends PureComponent<UserProviderProps, UserContextState> {
    state: Readonly<UserContextState> = {
        token: Cookies.getCookie("token") ?? null,
        email: Cookies.getCookie("email") ?? null,
        isAuthenticated: !!Cookies.getCookie("token"),
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

    async componentDidMount() {
        const token = Cookies.getCookie('token');
        const email = Cookies.getCookie('email');
        if (token && email) {
            this.setState(prevState => ({
                ...prevState,
                token,
                email,
                isAuthenticated: true
            }));
        }
    }

    setLogin = (token: string, email: string): void => {
        Cookies.setCookie('token', token, 1);
        Cookies.setCookie('email', email, 1);
        this.setState(prevState => ({
            ...prevState,
            token,
            email,
            isAuthenticated: true
        }));
    };

    setLogout = (): void => {
        Cookies.deleteCookie('token');
        Cookies.deleteCookie('email');
        this.setState({
            token: null,
            email: null,
            isAuthenticated: false
        });
    };
}

export default UserContextProvider;
