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

interface RegistrationProps extends UserContextActions { }

class Registration extends UIReact<RegistrationProps, RegistrationState> {
  state: RegistrationState = {
    email: '',
    password: '',
    error: '',
    loading: false,
    success: false
  };

  handleRegisterSubmit = async () => {
    const { email, password } = this.state;

    // Валидация email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      this.setState({ error: 'Неверный формат email' });
      return;
    }
    // Простейшая валидация пароля
    if (password.length < 6) {
      this.setState({ error: 'Пароль должен содержать не менее 6 символов' });
      return;
    }

    this.setState({ loading: true, error: '' });
    try {
      const response = await fetch(`${origin}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Регистрация не удалась');
      }

      const data = await response.json();
      // Ожидается, что API возвращает токен (data.access) и объект user с email
      this.props?.setLogin(data.access, data.user.email);
      this.setState({ success: true });
    } catch (error: any) {
      this.setState({ error: error.message || 'Регистрация не удалась' });
    } finally {
      this.setState({ loading: false });
    }
  };

  render(): ReactNode {
    const { email, password, error, loading, success } = this.state;

    if (success) {
      return <Navigate to="/" replace />;
    }

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
      </div>
    );
  }
}

const UIRegistration = withContext(UserContext, Registration);

export default UIRegistration;
