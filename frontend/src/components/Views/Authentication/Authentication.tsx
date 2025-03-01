// src/components/Authentication/Authentication.tsx
import { ReactNode } from "react";
import styles from "./Authentication.module.scss";
import Registration from "./Registration/Registration";
import Login from "./Login/Login";
import OTPVerification from "./OTPVerification/OTPVerification";
import { TokenData, UserContextActions } from "components/Context/UserContext";
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
import { origin } from "../../../../project.config.json";

interface AuthenticationState {
  isLoginView: boolean;
  otpMode: boolean;
  otpEmail: string;
  otpPurpose: "login" | "registration";
  otpPassword?: string;
}

interface AuthenticationProps extends UserContextActions, WithTranslation {
  smallVersion?: boolean;
}

class Authentication extends UIReact<AuthenticationProps, AuthenticationState> {
  state: AuthenticationState = {
    isLoginView: true,
    otpMode: false,
    otpEmail: "",
    otpPurpose: "login",
    otpPassword: "",
  };

  toggleView = () => {
    this.setState(prev => ({ isLoginView: !prev.isLoginView }));
  };

  get lang(): string {
    return this.props.i18n.language;
  }

  pathlist = ["authentication"];

  get splittedPathname(): string[] {
    return location.pathname.split("/");
  }

  parseErrorMessage = (data: any): string => {
    if (!data) return "Неизвестная ошибка";
    if (typeof data === "string") return data;
    if (Array.isArray(data)) return data.join(" ");
    if (typeof data === "object") {
      if (data.non_field_errors) return data.non_field_errors.join(" ");
      if (data.detail) return data.detail;
      let messages: string[] = [];
      for (const key in data) {
        if (Array.isArray(data[key])) messages.push(data[key].join(" "));
        else if (typeof data[key] === "string") messages.push(data[key]);
      }
      return messages.join(" ") || "Неизвестная ошибка";
    }
    return "Неизвестная ошибка";
  };

  handleOTPRequest = async (data: {
    email: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    mobile_number?: string;
    purpose: "login" | "registration";
  }): Promise<boolean> => {
    try {
      const response = await fetch(`${origin}/auth/otp/request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json();
        const msg = this.parseErrorMessage(errorData);
        throw new Error(msg || "Запрос провалился");
      }
      this.setState({
        otpMode: true,
        otpEmail: data.email,
        otpPurpose: data.purpose,
        otpPassword: data.password || ""
      });
      return true;
    } catch (error) {
      console.error("Запрос провалился", error);
      throw error;
    }
  };

  handleOTPSuccess = async (tokenData: TokenData) => {
    this.props.setLogin(tokenData.access, tokenData.user);
    this.setState({ otpMode: false });
  };

  render(): ReactNode {
    const { isLoginView, otpMode, otpEmail, otpPurpose, otpPassword } = this.state;
    const { isAuthenticated, smallVersion } = this.props;

    if (isAuthenticated) {
      const shouldNavigate = this.splittedPathname.some(segment =>
        this.pathlist.some(path => segment.includes(path))
      );
      return shouldNavigate ? <Navigate to={`/${this.lang}/profile`} /> : null;
    }
    return (
      <section className={styles["auth-section"]}>
        <div className={styles["auth-container"]}>
          <div className={`${styles["authentication-wrapper"]} ${smallVersion ? styles.small : ""}`}>
            {!smallVersion && (
              <div className={styles["authentication-image-container"]}>
                <img src={auth} alt="" />
              </div>
            )}

            <div className={styles["authentication-content"]}>
              {!smallVersion && (
                <>
                  <div className={styles["authentication-logo-container"]}>
                    <img src={logo} alt="" />
                  </div>
                  <div className={styles["authentication-back-link-container"]}>
                    <Link to={`/${this.lang}`}>
                      <FontAwesomeIcon icon={faArrowLeftLong} />
                    </Link>
                  </div>
                </>
              )}
              {otpMode ? (
                <OTPVerification
                  email={otpEmail}
                  purpose={otpPurpose}
                  onSuccess={this.handleOTPSuccess}
                  password={otpPassword}
                />
              ) : (
                <>
                  {isLoginView ? (
                    <Login onOTPRequest={this.handleOTPRequest} />
                  ) : (
                    <Registration onOTPRequest={this.handleOTPRequest} />
                  )}
                  <div className={styles["authentication-toggleContainer"]}>
                    {isLoginView ? "Еще нету аккаунта?" : "Есть аккаунт?"}
                    <button onClick={this.toggleView}>
                      {isLoginView ? "Регистрация" : "Логин"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const UIAuthentication = getWithTranslation(withContext(UserContext, Authentication));
export default UIAuthentication;
