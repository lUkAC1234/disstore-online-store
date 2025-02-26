import styles from "../Login/Login.module.scss";
import { ReactNode } from "react";
import { withContext } from "components/Context/ContextInjector";
import { UserContextActions } from "components/Context/UserContext";
import { UserContext } from "components/Context/ContextCollection";
import { origin } from "../../../../../project.config.json";
import UIReact from "utils/classes/UIReact";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

interface RegistrationState {
  email: string;
  password: string;
  errorEmail: string;
  errorPassword: string;
  loading: boolean;
  success: boolean;
  showPassword: boolean;
  submitted: boolean;
}

interface RegistrationProps extends UserContextActions { }

class Registration extends UIReact<RegistrationProps, RegistrationState> {
  state: RegistrationState = {
    email: '',
    password: '',
    errorEmail: '',
    errorPassword: '',
    loading: false,
    success: false,
    showPassword: false,
    submitted: false,
  };

  togglePasswordVisibility = () => {
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  // Функция валидатора пароля возвращает только первую обнаруженную ошибку
  validatePassword = (password: string): string => {
    if (password.length < 6) {
      return "Пароль должен содержать не менее 6 символов";
    }
    if (!/[A-Z]/.test(password)) {
      return "Пароль должен содержать хотя бы одну заглавную букву";
    }
    const commonPasswords = [
      "password", "123456", "qwerty", "111111", "12345678",
      "abc123", "1234567", "password1", "12345"
    ];
    if (commonPasswords.includes(password.toLowerCase())) {
      return "Пароль слишком простой";
    }
    return "";
  };

  handleRegisterSubmit = async () => {
    this.setState({ submitted: true });
    const { email, password } = this.state;
    let errorEmail = "";
    let errorPassword = "";
    let isValid = true;

    // Валидация email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      errorEmail = 'Неверный формат email';
      isValid = false;
    }
    const passwordValidationError = this.validatePassword(password);
    if (passwordValidationError) {
      errorPassword = passwordValidationError;
      isValid = false;
    }
    if (!isValid) {
      this.setState({ errorEmail, errorPassword });
      return;
    }

    this.setState({ loading: true, errorEmail: "", errorPassword: "" });
    try {
      const response = await fetch(`${origin}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        if (result.email) {
          errorEmail = result.email;
        }
        if (result.password) {
          errorPassword = result.password;
        }
        if (!errorEmail && !errorPassword) {
          errorEmail = result.message || 'Регистрация не удалась';
        }
        this.setState({ errorEmail, errorPassword });
        return;
      }

      this.props?.setLogin(result.access, result.user);
      this.setState({ success: true });
    } catch (error: any) {
      this.setState({ errorEmail: error.message || 'Регистрация не удалась' });
    } finally {
      this.setState({ loading: false });
    }
  };

  render(): ReactNode {
    const { email, password, errorEmail, errorPassword, loading, success, showPassword, submitted } = this.state;

    if (success) {
      return <Navigate to="/" replace />;
    }

    return (
      <div className={styles.registrationContainer}>
        <h3 className={styles["helper-title"]}>Создайте аккаунт</h3>
        <p className={styles["helper-text"]}>Пожалуйста, заполните поля для регистрации</p>
        <div className={styles["formGroup-container"]}>
          <div className={styles["form-group"]}>
            <label htmlFor="email">Почта</label>
            <div className={`${styles["input-container"]} ${
              submitted && email ? (errorEmail ? styles.error : styles.success) : ''
            }`}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => this.setState({ email: e.target.value, errorEmail: "", submitted: false })}
                required
                placeholder="example@gmail.com"
                className={styles["inputField"]}
              />
            </div>
            {submitted && errorEmail && <div className={styles["errorMessage"]}>{errorEmail}</div>}
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="password">Пароль</label>
            <div className={`${styles["input-container"]} ${
              submitted && password ? (errorPassword ? styles.error : styles.success) : ''
            }`}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                value={password}
                onChange={(e) => this.setState({ password: e.target.value, errorPassword: "", submitted: false })}
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
            {submitted && errorPassword && <div className={styles["errorMessage"]}>{errorPassword}</div>}
          </div>
          <button
            onClick={this.handleRegisterSubmit}
            disabled={loading}
            className={styles["submitButton"]}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </div>
      </div>
    );
  }
}

const UIRegistration = withContext(UserContext, Registration);
export default UIRegistration;
