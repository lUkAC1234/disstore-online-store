import styles from "./Registration.module.scss";
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
  error: string;
  loading: boolean;
  success: boolean;
  showPassword: boolean;
}

interface RegistrationProps extends UserContextActions { }

class Registration extends UIReact<RegistrationProps, RegistrationState> {
  state: RegistrationState = {
    email: '',
    password: '',
    error: '',
    loading: false,
    success: false,
    showPassword: false,
  };

  togglePasswordVisibility = () => {
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push("Пароль должен содержать не менее 6 символов");
    }

    let hasUpperCase = false;
    for (const char of password) {
      if (char >= "A" && char <= "Z") {
        hasUpperCase = true;
        break;
      }
    }
    if (!hasUpperCase) {
      errors.push("Пароль должен содержать хотя бы одну заглавную букву");
    }

    const commonPasswords = [
      "password", "123456", "qwerty", "111111", "12345678",
      "abc123", "1234567", "password1", "12345"
    ];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push("Пароль слишком простой");
    }

    return errors;
  };

  handleRegisterSubmit = async () => {
    const { email, password } = this.state;

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      this.setState({ error: 'Неверный формат email' });
      return;
    }

    const passwordErrors = this.validatePassword(password);
    if (passwordErrors.length > 0) {
      this.setState({ error: passwordErrors.join(". ") });
      return;
    }

    this.setState({ loading: true, error: '' });
    try {
      const response = await fetch(`${origin}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.email || 'Регистрация не удалась');
      }

      const data = await response.json();
      this.props?.setLogin(data.access, data.user);
      this.setState({ success: true });
    } catch (error: any) {
      this.setState({ error: error.message });
      console.log(error.message)
    } finally {
      this.setState({ loading: false });
    }
  };

  render(): ReactNode {
    const { email, password, error, loading, success, showPassword } = this.state;

    if (success) {
      return <Navigate to="/" replace />;
    }

    const passwordRequirements = this.validatePassword(password);

    return (
      <div className={styles.registrationContainer}>
        <h3 className={styles["helper-title"]}>Создайте аккаунт</h3>
        <p className={styles["helper-text"]}>Пожалуйста, заполните поля для регистрации</p>
        <div className={styles["formGroup-container"]}>
          <div className={styles["form-group"]}>
            <label htmlFor="address">Почта</label>
            <div className={styles["input-container"]}>
              <input
                type="email"
                name="example@email.com"
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
                required
                placeholder="example@gmail.com"
                className={styles["inputField"]}
              />
            </div>
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="password">Пароль</label>
            <div className={styles["input-container"]}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
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
            onClick={this.handleRegisterSubmit}
            disabled={loading}
            className={styles["submitButton"]}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {password && passwordRequirements.length > 0 && (
          <div className={styles.passwordRequirements}>
            <p>Для надежности пароль должен соответствовать следующим требованиям:</p>
            <ul>
              {passwordRequirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

const UIRegistration = withContext(UserContext, Registration);
export default UIRegistration;
