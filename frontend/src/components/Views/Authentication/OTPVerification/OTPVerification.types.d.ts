declare global {
  interface OTPVerificationProps {
    email: string;
    purpose: "registration" | "login";
    onSuccess: (tokenData: TokenData) => void;
    onChangeData?: () => void;
    password?: string;
  }
  interface OTPVerificationState {
    otp: string[];
    error: string;
    message: string;
    loading: boolean;
    resendDelay: number;
  }
}

export { }