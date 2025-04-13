import { PureComponent, ChangeEvent } from "react";
import { extractDigits, formatPhoneDigits } from "./Phone.utils";
import { Input } from "../Html/Elements/Elements";

class ControlledPhoneInput extends PureComponent<PhoneInputProps> {
  private rawDigits: string = extractDigits(this.props.value) || "";

  handleChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    const inputType = (evt.nativeEvent as InputEvent).inputType;
    let newDigits = this.rawDigits;
    if (inputType && inputType.startsWith("delete")) { newDigits = newDigits.slice(0, -1); } 
    else { newDigits = extractDigits(evt.target.value); }
    newDigits = newDigits.slice(0, 9);
    this.rawDigits = newDigits;
    const formattedPhone = newDigits ? formatPhoneDigits(newDigits) : "";
    this.props.onChange(formattedPhone, newDigits);
  };

  render() {
    const { value, placeholder } = this.props;
    return (
      <Input
        type="tel"
        name="phone"
        value={value}
        onChange={this.handleChange}
        placeholder={placeholder || "+998 (__) ___ __ __"}
      />
    );
  }
}

export default ControlledPhoneInput;
