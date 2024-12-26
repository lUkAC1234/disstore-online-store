import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { autoBindMethods } from "utils/hooks/bind";
import { setFormItem } from "./form.util";
import { ContactUsContext } from "./ContextCollection";
import updateLoggerSnapshot from "utils/hooks/updateLoggerSnapshot";
import debug from "constants/debug";

export { ContactUsContext };

export interface ContactUsContextState {
  fullname: string;
  email: string;
  phone: string;
  text: string;
  files: FormItemFile[];
  coordinates: string;
  posting: boolean;
}

export interface ContactUsContextStateWithActions extends ContactUsContextState {
  setContactItem: <T>(key: keyof ContactUsContextState, value: T) => void;
  cleanUp: () => void;
}

export interface ContactUsContextProps extends PropsWithChildren {}

class ContactUsContextProvider extends PureComponent<ContactUsContextProps, ContactUsContextState> implements BindMethods {
  state: Readonly<ContactUsContextState> = {
    fullname: "",
    email: "",
    phone: "",
    text: "",
    files: [],
    coordinates: "",
    posting: false,
  };

  methods: BindItem[] = [
    { func: this.setContactItem, context: this },
    { func: this.cleanUp, context: this },
  ];

  constructor(props: Readonly<ContactUsContextProps>) {
    super(props);
    autoBindMethods(this);
  }

  render(): ReactNode {
    return (
      <ContactUsContext.Provider value={{
        ...this.state,
        setContactItem: this.setContactItem,
        cleanUp: this.cleanUp,
      }}>
        {this.props.children}
      </ContactUsContext.Provider>
    );
  }

  componentDidUpdate(): void {
    if (debug) {
      updateLoggerSnapshot("Contact Us update", this.props, this.state);
    }
  }

  setContactItem<T>(key: keyof ContactUsContextState, value: T): void {
    setFormItem(this, key, value);
  }

  cleanUp(): void {
    this.setState({ fullname: "", email: "", phone: "", text: "", files: [], coordinates: "", posting: false });
  }
}

export default ContactUsContextProvider;
