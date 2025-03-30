declare global {
  interface PhoneInputProps {
    value?: string;
    onChange?: (formattedPhone: string, rawDigits: string) => void;
    placeholder?: string;
  }
  
  interface PhoneInputState {
    phone: string;
    rawDigits: string;
  }
}

export { }