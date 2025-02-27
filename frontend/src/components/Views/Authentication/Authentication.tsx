import { ReactNode } from "react";
import styles from "./Authentication.module.scss";
import Registration from "./Registration/Registration";
import Login from "./Login/Login";
import { UserContextActions } from "components/Context/UserContext";
import { UserContext } from "components/Context/ContextCollection";
import { withContext } from "components/Context/ContextInjector";
import UIReact from "utils/classes/UIReact";
import auth from "assets/main/images/auth/auth.webp";
import logo from "assets/main/images/layout/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { Link, Navigate } from "react-router-dom";
import { WithTranslation } from "react-i18next";
import { getWithTranslation } from "i18n/hooks";

interface AuthenticationState {
    isLoginView: boolean;
}

interface AuthenticationProps extends UserContextActions, WithTranslation {
    smallVersion?: boolean; // Новое свойство для вызова компактной версии
}

class Authentication extends UIReact<AuthenticationProps, AuthenticationState> {
    state: AuthenticationState = {
        isLoginView: true
    };

    toggleView = () => {
        this.setState(prev => ({ isLoginView: !prev.isLoginView }));
    };

    get lang(): string {
        return this.props.i18n.language;
    }

    pathlist = [
        "authentication",
    ]

    get splittedPathname(): string[] {
        return location.pathname.split("/");
    }

    render(): ReactNode {
        const { isLoginView } = this.state;
        const { isAuthenticated, smallVersion } = this.props;
        let navigateToProfile: boolean = false;

        if (isAuthenticated) {
            for (let i = 0; i < this.splittedPathname.length; ++i) {
                const pathname: string = this.splittedPathname[i];
                console.log(pathname);

                for (let j = 0; j < this.pathlist.length; ++j) {
                    const pathListItem: string = this.pathlist[j];

                    if (pathname.includes(pathListItem)) {
                        navigateToProfile = true;
                    }
                }
            }

            if (!navigateToProfile) {
                return;
            }

            return <Navigate to={`/${this.lang}/profile`} />;
        }

        return (
            <section className={styles["auth-section"]}>
                <div className={styles["auth-container"]}>
                    <div className={`${styles["authentication-wrapper"]} ${smallVersion ? styles.small : ""}`}>
                        <div className={styles["authentication-image-container"]}>
                            <img src={auth} alt="" />
                        </div>
                        <div className={styles["authentication-content"]}>
                            <div className={styles["authentication-logo-container"]}>
                                <img src={logo} alt="" />
                            </div>
                            <div className={styles["authentication-back-link-container"]}>
                                <Link to={`/${this.lang}`}>
                                    <FontAwesomeIcon icon={faArrowLeftLong} />
                                </Link>
                            </div>
                            {isLoginView ? <Login /> : <Registration />}
                            <div className={styles["authentication-toggleContainer"]}>
                                {isLoginView ? "Еще нету аккаунта?" : "Есть аккаунт?"}
                                <button onClick={this.toggleView}>
                                    {isLoginView ? "Регистрация" : "Логин"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const UIAuthentication = getWithTranslation(withContext(UserContext, Authentication));
export default UIAuthentication;
