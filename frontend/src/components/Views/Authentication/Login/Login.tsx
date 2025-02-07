import { ReactNode } from "react";
import styles from "./Login.module.scss";
import { UserContextActions } from "components/Context/UserContext";
import { UserContext } from "components/Context/ContextCollection";
import { withContext } from "components/Context/ContextInjector";
import UIReact from "utils/classes/UIReact";
import { origin } from "../../../../../project.config.json";
import { Navigate } from "react-router-dom";

interface LoginState {
    email: string;
    password: string;
    error: string;
    loading: boolean;
    success: boolean;
}

interface LoginProps extends UserContextActions { }

class Login extends UIReact<LoginProps, LoginState> {
    state: LoginState = {
        email: '',
        password: '',
        error: '',
        loading: false,
        success: false
    };

    handleLoginSubmit = async () => {
        const { email, password } = this.state;

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            this.setState({ error: 'Неверный формат email' });
            return;
        }
        if (!password) {
            this.setState({ error: 'Пароль обязателен' });
            return;
        }

        this.setState({ loading: true, error: '' });
        try {
            const response = await fetch(`${origin}/auth/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Неверный email или пароль');
            }
            
            const data = await response.json();
            this.props?.setLogin(data.access, data.user.email);
            this.setState({ success: true });
            console.log(data)
        } catch (error: any) {
            this.setState({ error: error.message || 'Неверный email или пароль' });
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
            <div className={styles.loginContainer}>
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
                        onClick={this.handleLoginSubmit}
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </div>
                {error && <div className={styles.errorMessage}>{error}</div>}
            </div>
        );
    }
}

const UILogin = withContext(UserContext, Login);

export default UILogin;
