import { ReactNode } from "react";
import styles from "./Authentication.module.scss";
import Registration from "./Registration/Registration";
import Login from "./Login/Login";
import { UserContextActions } from "components/Context/UserContext";
import { UserContext } from "components/Context/ContextCollection";
import { withContext } from "components/Context/ContextInjector";
import UIReact from "utils/classes/UIReact";
import auth from "assets/main/images/auth/auth.webp";
import logo from "assets/main/images/layout/logo.svg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { WithTranslation } from "react-i18next";
import { getWithTranslation } from "i18n/hooks";

interface AuthenticationState {
    isLoginView: boolean;
}

interface AuthenticationProps extends UserContextActions, WithTranslation { }

class Authentication extends UIReact<AuthenticationProps, AuthenticationState> {
    state: AuthenticationState = {
        isLoginView: true
    };

    toggleView = () => {
        this.setState(prev => ({ isLoginView: !prev.isLoginView }));
    };

    get lang(): string {
        return this.props.i18n.language
    }

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
                        <div className={styles["authentication-wrapper"]}>
                            <div className={styles["authentication-image-container"]}>
                                <img src={auth} alt="" />
                            </div>
                            <div className={styles["authentication-content"]}>
                                <div className={styles["authentication-logo-container"]}>
                                    <img src={logo} alt="" />
                                </div>
                                <div className={styles["authentication-back-link-container"]}>
                                    <Link to={`/${this.lang}`}><FontAwesomeIcon icon={faArrowLeftLong} /></Link>
                                </div>
                                {isLoginView ? <Login /> : <Registration />}
                                <div className={styles["authentication-toggleContainer"]}>
                                    {isLoginView ? 'Еще нету аккаунта?' : 'Есть аккаунт?'}
                                    <button onClick={() => this.setState({ isLoginView: !isLoginView })}>
                                        {isLoginView ? 'Регистрация' : 'Логин'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </section>
        );
    }
}

const UIAuthentication = getWithTranslation(withContext(UserContext, Authentication));
export default UIAuthentication;
