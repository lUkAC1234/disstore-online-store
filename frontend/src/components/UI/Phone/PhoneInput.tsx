import { ChangeEvent, PureComponent } from "react";
import { extractDigits, formatPhoneDigits } from "./Phone.utils";

class PhoneInput extends PureComponent<PhoneInputProps, PhoneInputState> {
  state: PhoneInputState = {
    phone: "",
    rawDigits: "",
  };

  handleChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    const inputType = (evt.nativeEvent as InputEvent).inputType;
    let newDigits = this.state.rawDigits;
    if (inputType && inputType.startsWith("delete")) { newDigits = newDigits.slice(0, -1); } 
    else { newDigits = extractDigits(evt.target.value); }
    newDigits = newDigits.slice(0, 9);
    const formattedPhone = newDigits ? formatPhoneDigits(newDigits) : "";
    this.setState({ phone: formattedPhone, rawDigits: newDigits }, () => {
      if (this.props.onChange) { this.props.onChange(this.state.phone, this.state.rawDigits); }
    });
  };

  render() {
    const { placeholder } = this.props;
    return (
      <input
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