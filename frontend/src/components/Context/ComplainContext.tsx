import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { autoBindMethods } from "utils/hooks/bind";
import { setFormItem } from "./form.util";
import { ComplainContext } from "./ContextCollection";
import updateLoggerSnapshot from "utils/hooks/updateLoggerSnapshot";
import debug from "constants/debug";

export { ComplainContext };

export interface ComplainContextState {
  tree_id: number;
  fullname: string;
  email: string;
  phone: string;
  text: string;
  files: FormItemFile[];
  posting: boolean;
}

export interface ComplainContextStateWithActions extends ComplainContextState {
  setContactItem: <T>(key: keyof ComplainContextState, value: T) => void;
  cleanUp: () => void;
}

export interface ComplainContextProps extends PropsWithChildren {}

class ComplainContextProvider extends PureComponent<ComplainContextProps, ComplainContextState> implements BindMethods {
  state: Readonly<ComplainContextState> = {
    tree_id: 0,
    fullname: "",
    email: "",
    phone: "",
    text: "",
    files: [],
    posting: false,
  };

  methods: BindItem[] = [
    { func: this.setContactItem, context: this },
  ];

  constructor(props: Readonly<ComplainContextProps>) {
    super(props);
    autoBindMethods(this);
  }

  render(): ReactNode {
    return (
      <ComplainContext.Provider value={{
        ...this.state,
        setContactItem: this.setContactItem,
        cleanUp: this.cleanUp,
      }}>
        {this.props.children}
      </ComplainContext.Provider>
    );
  }

  componentDidUpdate(): void {
    if (debug) {
      updateLoggerSnapshot("Complain Us update", this.props, this.state);
    }
  }

  setContactItem<T>(key: keyof ComplainContextState, value: T): void {
    setFormItem(this, key, value);
  }

  cleanUp(): void {
    this.setState({ fullname: "", email: "", phone: "", text: "", tree_id: null, files: [], posting: false });
  }
}

export default ComplainContextProvider;
