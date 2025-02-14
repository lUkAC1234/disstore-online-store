import { ReactNode } from "react";
import styles from "./Authentication.module.scss";
import Registration from "./Registration/Registration";
import Login from "./Login/Login";
import { UserContextActions } from "components/Context/UserContext";
import { UserContext } from "components/Context/ContextCollection";
import { withContext } from "components/Context/ContextInjector";
import UIReact from "utils/classes/UIReact";

interface AuthenticationState {
    isLoginView: boolean;
}

interface AuthenticationProps extends UserContextActions { }

class Authentication extends UIReact<AuthenticationProps, AuthenticationState> {
    state: AuthenticationState = {
        isLoginView: true
    };

    toggleView = () => {
        this.setState(prev => ({ isLoginView: !prev.isLoginView }));
    };

    render(): ReactNode {
        const { isLoginView } = this.state;
        const { isAuthenticated } = this.props;

        return (
            <section className={styles["auth-section"]}>
                <div className={styles["auth-container"]}>
                    {isAuthenticated ? (
                        <div>
                            <h2>Вы уже авторизованы</h2>
                            <p>{this.props.user?.email}</p>
                            <p>{this.props.user?.first_name}</p>
                            <p>{this.props.user?.last_name}</p>
                            <p>{this.props.user?.mobile_number}</p>
                            <button onClick={this.props.setLogout}>Выйти</button>
                        </div>
                    ) : (
                        <>
                            <div className={styles.toggleContainer}>
                                <button
                                    className={isLoginView ? styles.active : ''}
                                    onClick={() => this.setState({ isLoginView: true })}
                                >
                                    Login
                                </button>
                                <button
                                    className={!isLoginView ? styles.active : ''}
                                    onClick={() => this.setState({ isLoginView: false })}
                                >
                                    Register
                                </button>
                            </div>

                            {isLoginView ? <Login /> : <Registration />}
                        </>
                    )}

                </div>
            </section>
        );
    }
}

const UIAuthentication = withContext(UserContext, Authentication);

export default UIAuthentication;
