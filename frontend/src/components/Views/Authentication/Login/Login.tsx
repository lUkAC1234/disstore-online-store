// src/components/Authentication/Login/Login.tsx
import styles from "./Login.module.scss";
import { ReactNode } from "react";
import { UserContextActions } from "components/Context/UserContext";
import { UserContext } from "components/Context/ContextCollection";
import { withContext } from "components/Context/ContextInjector";
import UIReact from "utils/classes/UIReact";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

interface LoginState {
  email: string;
  password: string;
  emailError: boolean;
  passwordError: boolean | string;
  loading: boolean;
  success: boolean;
  showPassword: boolean;
  error: string;
}

interface LoginProps extends UserContextActions {
  onOTPRequest: (data: { email: string; password: string; purpose: "login" }) => Promise<boolean>;
}

class Login extends UIReact<LoginProps, LoginState> {
  state: LoginState = {
    email: "",
    password: "",
    emailError: false,
    passwordError: false,
    loading: false,
    success: false,
    showPassword: false,
    error: "",
  };

  togglePasswordVisibility = () => {
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  handleLoginSubmit = async () => {
    const { email, password } = this.state;
    let emailError = false;
    let passwordError = false;
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      emailError = true;
    }
    if (!password) {
      passwordError = true;
    }
    if (emailError || passwordError) {
      this.setState({ emailError, passwordError });
      return;
    }
    this.setState({ loading: true, emailError: false, passwordError: false, error: "" });
    try {
      await this.props.onOTPRequest({ email, password, purpose: "login" });
    } catch (error) {
      this.setState({ emailError: true, passwordError: error.message, error: error.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  render(): ReactNode {
    const { email, password, emailError, passwordError, loading, success, showPassword, error } = this.state;
    if (success) {
      return <Navigate to="/" replace />;
    }
    return (
      <div className={styles["loginContainer"]}>
        <h3 className={styles["helper-title"]}>Добро пожаловать</h3>
        <p className={styles["helper-text"]}>Пожалуйста, заполните поля для входа</p>
        <div className={styles["formGroup-container"]}>
          <div className={styles["form-group"]}>
            <label htmlFor="address">Почта</label>
            <div className={`${styles["input-container"]} ${email ? (emailError ? styles.error : styles.success) : ''}`}>
              <input
                type="email"
                value={email}
                onChange={(e) => this.setState({ email: e.target.value, emailError: false })}
                required
                placeholder="example@gmail.com"
                className={styles["inputField"]}
              />
            </div>
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="password">Пароль</label>
            <div className={`${styles["input-container"]} ${password ? (passwordError ? styles.error : styles.success) : ''}`}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                value={password}
                onChange={(e) => this.setState({ password: e.target.value, passwordError: false })}
                className={styles["inputField"]}
                required
                name="password"
              />
              <button
                type="button"
                onClick={this.togglePasswordVisibility}
                className={styles["togglePasswordButton"]}
              >
                {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
              </button>
            </div>
          </div>
          <button
            onClick={this.handleLoginSubmit}
            disabled={loading}
            className={styles["submitButton"]}
          >
            {loading ? "Вход..." : "Войти"}
          </button>
          {error && <div className={styles["errorMessage"]}>{error}</div>}
        </div>
      </div>
    );
  }
}

const UILogin = withContext(UserContext, Login);
export default UILogin;
