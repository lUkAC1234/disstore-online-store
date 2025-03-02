declare global {
  interface LoginProps {
    onOTPRequest: (data: { email: string; password: string; purpose: "login" }) => Promise<boolean>;
  }
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
}

export { }