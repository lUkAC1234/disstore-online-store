import { ReactNode } from "react";
import styles from "./Registration.module.scss";
import { withContext } from "components/Context/ContextInjector";
import { UserContextActions } from "components/Context/UserContext";
import { UserContext } from "components/Context/ContextCollection";
import { origin } from "../../../../../project.config.json";
import UIReact from "utils/classes/UIReact";
import { Navigate } from "react-router-dom";

interface RegistrationState {
  email: string;
  password: string;
  error: string;
  loading: boolean;
  success: boolean;
}

interface RegistrationProps extends UserContextActions {}

class Registration extends UIReact<RegistrationProps, RegistrationState> {
  state: RegistrationState = {
    email: '',
    password: '',
    error: '',
    loading: false,
    success: false,
  };

  // Validate password by checking each criterion and return an array of missing requirements.
  validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    // Check minimum length
    if (password.length < 6) {
      errors.push("Пароль должен содержать не менее 6 символов");
    }

    // Check for at least one uppercase letter (without regex)
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

    // Check if the password is too common
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

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      this.setState({ error: 'Неверный формат email' });
      return;
    }

    // Validate password with detailed requirements
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
      // Pass the complete user object to setLogin so that context gets all details.
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
    const { email, password, error, loading, success } = this.state;

    if (success) {
      return <Navigate to="/" replace />;
    }

    // Get missing password requirements (if any)
    const passwordRequirements = this.validatePassword(password);

    return (
      <div className={styles.registrationContainer}>
        <div className={styles.formGroup}>
          <input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => this.setState({ email: e.target.value })}
            className={styles.inputField}
          />
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => this.setState({ password: e.target.value })}
            className={styles.inputField}
          />
          <button
            onClick={this.handleRegisterSubmit}
            disabled={loading}
            className={styles.submitButton}
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
