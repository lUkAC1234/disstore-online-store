declare global {
  interface RegistrationProps {
    onOTPRequest: (data: {
      email: string;
      password: string;
      first_name?: string;
      last_name?: string;
      mobile_number?: string;
      purpose: "registration";
    }) => Promise<boolean>;
  }
  interface RegistrationState {
    email: string;
    password: string;
    errorEmail: string;
    errorPassword: string;
    loading: boolean;
    success: boolean;
    showPassword: boolean;
    submitted: boolean;
  }
}

export { }