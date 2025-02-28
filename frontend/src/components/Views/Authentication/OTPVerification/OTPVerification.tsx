import styles from "./OTPVerification.module.scss";
import { PureComponent, RefObject, createRef } from "react";
import { origin } from "../../../../../project.config.json";

interface OTPVerificationProps {
  email: string;
  purpose: "registration" | "login";
  onSuccess: (tokenData: any) => void;
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

class OTPVerification extends PureComponent<OTPVerificationProps, OTPVerificationState> {
  inputRefs: Array<RefObject<HTMLInputElement>>;
  intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(props: OTPVerificationProps) {
    super(props);
    this.state = {
      otp: Array(6).fill(""),
      error: "",
      message: "",
      loading: false,
      resendDelay: 0,
    };
    this.inputRefs = Array.from({ length: 6 }, () => createRef<HTMLInputElement>());
  }

  componentDidMount() {
    if (this.state.resendDelay > 0) {
      this.startCountdown();
    }
  }

  componentDidUpdate(prevProps: OTPVerificationProps, prevState: OTPVerificationState) {
    if (this.state.resendDelay > 0 && prevState.resendDelay === 0) {
      this.startCountdown();
    }
  }

  componentWillUnmount() {
    this.clearCountdown();
  }

  clearCountdown = () => {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  };

  startCountdown = () => {
    this.clearCountdown();
    this.intervalId = setInterval(() => {
      this.setState(prevState => {
        if (prevState.resendDelay <= 1) {
          this.clearCountdown();
          return { resendDelay: 0 };
        }
        return { resendDelay: prevState.resendDelay - 1 };
      });
    }, 1000);
  };

  parseErrorMessage = (data: any): string => {
    if (!data) return "Неизвестная ошибка";
    if (typeof data === "string") return data;
    if (Array.isArray(data)) return data.join(" ");
    if (typeof data === "object") {
      if (data.non_field_errors) return data.non_field_errors.join(" ");
      if (data.detail) return data.detail;
      return Object.entries(data)
        .map(([_, value]) => (Array.isArray(value) ? value.join(" ") : value))
        .join(" ") || "Неизвестная ошибка";
    }
    return "Неизвестная ошибка";
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (!/^\d*$/.test(value)) return;
    const otp = [...this.state.otp];
    otp[index] = value.slice(-1); 
    this.setState({ otp, error: "" }, () => {
      if (value && index < this.inputRefs.length - 1) {
        this.inputRefs[index + 1].current?.focus();
      }
    });
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !this.state.otp[index] && index > 0) {
      this.inputRefs[index - 1].current?.focus();
    }
  };

  handleVerify = async () => {
    const code = this.state.otp.join("");
    if (code.length < 6) {
      this.setState({ error: "Введите полный код из 6 цифр." });
      return;
    }
    this.setState({ loading: true, error: "", message: "" });
    try {
      const response = await fetch(`${origin}/auth/otp/verify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.props.email,
          code,
          purpose: this.props.purpose,
        }),
      });
      const resData = await response.json();
      if (!response.ok) {
        const errorMsg = this.parseErrorMessage(resData);
        this.setState({ error: errorMsg, loading: false });
        return;
      }
      this.clearCountdown();
      this.setState({ resendDelay: 0, loading: false });
      this.props.onSuccess(resData);
    } catch (err: any) {
      this.setState({ error: err.message || "Ошибка запроса.", loading: false });
    }
  };

  handleResend = async () => {
    if (this.state.resendDelay > 0) return;
    this.setState({ loading: true, error: "", message: "" });
    try {
      const payload: any = { email: this.props.email, purpose: this.props.purpose };
      if (this.props.purpose === "login") {
        if (!this.props.password) {
          this.setState({ error: "Пароль обязателен для логина.", loading: false });
          return;
        }
        payload.password = this.props.password;
      }
      const response = await fetch(`${origin}/auth/otp/request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const resData = await response.json();
      if (!response.ok) {
        const errorMsg = this.parseErrorMessage(resData);
        this.setState({ error: errorMsg, loading: false });
        return;
      }
      this.setState(
        {
          message: "Код повторно отправлен",
          resendDelay: 60,
          loading: false,
          otp: Array(6).fill(""),
        },
        () => {
          this.startCountdown();
          this.inputRefs[0].current?.focus();
        }
      );
    } catch (err) {
      this.setState({ error: err.message || "Ошибка запроса.", loading: false });
    }
  };

  render() {
    const { otp, error, message, loading, resendDelay } = this.state;
    return (
      <div className={styles["otpContainer"]}>
        <h3 className={styles["helper-title"]}>Введите код</h3>
        <p className={styles["helper-text"]}>
          Пожалуйста, введите 6-значный код, отправленный на вашу почту.
        </p>
        <div className={styles.otpInputs}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => this.handleChange(e, index)}
              onKeyDown={(e) => this.handleKeyDown(e, index)}
              ref={this.inputRefs[index]}
              className={styles.otpInput}
            />
          ))}
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <button onClick={this.handleVerify} disabled={loading} className={styles.submitButton}>
          {loading ? "Проверка..." : "Проверить"}
        </button>
        <div className={styles.resendContainer}>
          <button onClick={this.handleResend} disabled={resendDelay > 0 || loading}>
            {resendDelay > 0
              ? `Отправить повторно через ${resendDelay} сек`
              : "Отправить повторно"}
          </button>
        </div>
        {message && <div className={styles.message}>{message}</div>}
      </div>
    );
  }
}

export default OTPVerification;
