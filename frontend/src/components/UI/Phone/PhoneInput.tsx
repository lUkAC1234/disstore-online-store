import { ChangeEvent, PureComponent } from "react";
import { extractDigits, formatPhoneDigits } from "./Phone.utils";
import { Input } from "../Html/Elements/Elements";

export interface PhoneInputProps {
  value?: string;
  onChange?: (formattedPhone: string) => void;
  placeholder?: string;
}

export interface PhoneInputState {
  phone: string;
  rawDigits: string;
}

class PhoneInput extends PureComponent<PhoneInputProps, PhoneInputState> {
  state: PhoneInputState = {
    phone: this.props.value || "",
    rawDigits: extractDigits(this.props.value || ""),
  };

  handleChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    const newDigits = extractDigits(evt.target.value).slice(0, 9);
    const formattedPhone = newDigits ? formatPhoneDigits(newDigits) : "";
    this.setState({ phone: formattedPhone, rawDigits: newDigits }, () => {
      if (this.props.onChange) {
        this.props.onChange(formattedPhone);
      }
    });
  };

  render() {
    const { placeholder } = this.props;
    return (
      <Input
        type="tel"
        name="phone"
        value={this.state.phone}
        onChange={this.handleChange}
        required
        placeholder={placeholder || "+998 (__) ___ __ __"}
      />
    );
  }
}

export default PhoneInput;
