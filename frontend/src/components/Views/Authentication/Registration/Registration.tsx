import { ReactNode } from "react";
import styles from "./Registration.module.scss";
import { withContext } from "components/Context/ContextInjector";
import { UserContextActions } from "components/Context/UserContext";
import { UserContext } from "components/Context/ContextCollection";
import { origin } from "../../../../../project.config.json";
import UIReact from "utils/classes/UIReact";
import { Navigate } from "react-router-dom";

interface RegistrationState {
  mobileNumber: string;
  otp: string;
  step: 'input' | 'verify';
  error: string;
  loading: boolean;
  success: boolean;
}

interface RegistrationProps extends UserContextActions { }

class Registration extends UIReact<RegistrationProps, RegistrationState> {
  state: RegistrationState = {
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
      const response = await fetch(`${origin}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: mobileNumber })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400 && errorData.error.includes('already exists')) {
          throw new Error('This mobile number is already registered. Please log in instead.');
        }
        throw new Error(errorData.error || 'Registration failed');
      }

      this.setState({ step: 'verify', error: '' });
    } catch (error: any) {
      this.setState({ error: error.message || 'Registration failed' });
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
      <div className={styles.registrationContainer}>
        {step === 'input' ? (
          <>
            <input
              type="tel"
              placeholder="+998XXXXXXXXX"
              value={mobileNumber}
              onChange={(e) => this.setState({ mobileNumber: e.target.value })}
            />
            <button
              onClick={this.handleMobileSubmit}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </>
        ) : (
          <>
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => this.setState({ otp: e.target.value })}
            />
            <button
              onClick={this.handleOtpSubmit}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    );
  }
}

const UIRegistration = withContext(UserContext, Registration);

export default UIRegistration;