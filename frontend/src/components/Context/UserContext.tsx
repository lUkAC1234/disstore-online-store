import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { UserContext } from "./ContextCollection";

export interface UserProviderProps extends PropsWithChildren {}

export interface UserContextState {
    token: string | null;
    mobileNumber: string | null;
    isAuthenticated: boolean;
}

export interface UserContextActions extends UserContextState {
    setLogin: (token: string, mobileNumber: string) => void;
    setLogout: () => void;
}

class UserContextProvider extends PureComponent<UserProviderProps, UserContextState> {
    state: Readonly<UserContextState> = {
        token: localStorage.getItem('token'),
        mobileNumber: localStorage.getItem('mobileNumber'),
        isAuthenticated: !!localStorage.getItem('token'),
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
        )
    }

    componentDidMount() {
        const token = localStorage.getItem('authToken');
        const mobileNumber = localStorage.getItem('mobileNumber');
        if (token && mobileNumber) {
            this.setState({ isAuthenticated: true, mobileNumber });
        }
    }

    setLogin = (token: string, mobileNumber: string): void => {
        localStorage.setItem('token', token);
        localStorage.setItem('mobileNumber', mobileNumber);
        this.setState({
            token,
            mobileNumber,
            isAuthenticated: true
        });
    }

    setLogout = (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('mobileNumber');
        this.setState({
            token: null,
            mobileNumber: null,
            isAuthenticated: false
        });
    }
}

export default UserContextProvider;