import { ReactNode } from "react";
import styles from "./Login.module.scss";
import { UserContextActions } from "components/Context/UserContext";
import { UserContext } from "components/Context/ContextCollection";
import { withContext } from "components/Context/ContextInjector";
import UIReact from "utils/classes/UIReact";
import { origin } from "../../../../../project.config.json";
import { Navigate } from "react-router-dom";

interface LoginState {
    mobileNumber: string;
    otp: string;
    step: 'input' | 'verify';
    error: string;
    loading: boolean;
    success: boolean;
}

interface LoginProps extends UserContextActions { }

class Login extends UIReact<LoginProps, LoginState> {
    state: LoginState = {
        mobileNumber: '',
        otp: '',
        step: 'input',
        error: '',
        loading: false,
        success: false
    };

    handleMobileSubmit = async () => {
        const { mobileNumber } = this.state;
        if (!/^\+998\d{9}$/.test(mobileNumber)) {
            this.setState({ error: 'Invalid mobile number format' });
            return;
        }

        this.setState({ loading: true, error: '' });
        try {
            const response = await fetch(`${origin}/auth/send-otp/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile_number: mobileNumber })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send OTP');
            }
            
            this.setState({ step: 'verify', error: '' });
        } catch (error: any) {
            this.setState({ error: error.message || 'Failed to send OTP' });
        } finally {
            this.setState({ loading: false });
        }
    };

    handleOtpSubmit = async () => {
        const { mobileNumber, otp } = this.state;
        this.setState({ loading: true, error: '' });

        try {
            const response = await fetch(`${origin}/auth/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    mobile_number: mobileNumber,
                    otp: otp 
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Invalid OTP');
            }
            
            const data = await response.json();
            this.props?.setLogin(data.token, mobileNumber);
            this.setState({ success: true });
        } catch (error: any) {
            this.setState({ error: error.message || 'Invalid OTP' });
        } finally {
            this.setState({ loading: false });
        }
    };

    render(): ReactNode {
        const { step, mobileNumber, otp, error, loading, success } = this.state;

        if (success) {
            return <Navigate to="/" replace />;
        }

        return (
            <div className={styles.loginContainer}>
                {step === 'input' ? (
                    <div className={styles.formGroup}>
                        <input
                            type="tel"
                            placeholder="+998XXXXXXXXX"
                            value={mobileNumber}
                            onChange={(e) => this.setState({ mobileNumber: e.target.value })}
                            className={styles.inputField}
                        />
                        <button 
                            onClick={this.handleMobileSubmit}
                            disabled={loading}
                            className={styles.submitButton}
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </div>
                ) : (
                    <div className={styles.formGroup}>
                        <input
                            type="number"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => this.setState({ otp: e.target.value })}
                            className={styles.inputField}
                        />
                        <button 
                            onClick={this.handleOtpSubmit}
                            disabled={loading}
                            className={styles.submitButton}
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                )}
                {error && <div className={styles.errorMessage}>{error}</div>}
            </div>
        );
    }
}

const UILogin = withContext(UserContext, Login);

export default UILogin;