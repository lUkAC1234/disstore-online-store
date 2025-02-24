import styles from "./Login.module.scss";
import { ReactNode } from "react";
import { UserContextActions } from "components/Context/UserContext";
import { UserContext } from "components/Context/ContextCollection";
import { withContext } from "components/Context/ContextInjector";
import UIReact from "utils/classes/UIReact";
import { origin } from "../../../../../project.config.json";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

interface LoginState {
    email: string;
    password: string;
    error: string;
    loading: boolean;
    success: boolean;
    showPassword: boolean; // New state to toggle password visibility
}

interface LoginProps extends UserContextActions { }

class Login extends UIReact<LoginProps, LoginState> {
    state: LoginState = {
        email: '',
        password: '',
        error: '',
        loading: false,
        success: false,
        showPassword: false 
    };

    // Toggle function to change password visibility
    togglePasswordVisibility = () => {
        this.setState(prevState => ({ showPassword: !prevState.showPassword }));
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
            this.props?.setLogin(data.access, data.user);
            this.setState({ success: true });
            console.log(data);
        } catch (error: any) {
            this.setState({ error: error.message || 'Неверный email или пароль' });
        } finally {
            this.setState({ loading: false });
        }
    };

    render(): ReactNode {
        const { email, password, error, loading, success, showPassword } = this.state;

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
                                {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> :<FontAwesomeIcon icon={faEye} />}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={this.handleLoginSubmit}
                        disabled={loading}
                        className={styles["submitButton"]}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </div>
                {error && <div className={styles["errorMessage"]}>{error}</div>}
            </div>
        );
    }
}

const UILogin = withContext(UserContext, Login);

export default UILogin;
