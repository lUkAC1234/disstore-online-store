import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { UserContext } from "./ContextCollection";

export interface UserProviderProps extends PropsWithChildren {}

export interface UserContextState {
    username: string;
}

export interface UserContextActions extends UserContextState {
    setUsername: (username: string) => void;
}

class UserContextProvider extends PureComponent<UserProviderProps, UserContextState> {
    state: Readonly<UserContextState> = {
        username: "",
    };

    render(): ReactNode {
        return (
            <UserContext.Provider
               value={{
                  ...this.state,
                  setUsername: this.setUsername,
               }}
            >
                {this.props.children}
            </UserContext.Provider>
        )
    }

    setUsername = (username: string): void => {
        this.setState(prevState => ({
            ...prevState,
           username,
        }));
    }
}

export default UserContextProvider;
