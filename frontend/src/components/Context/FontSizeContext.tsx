import { PropsWithChildren, ReactNode } from "react";
import { autoBindMethods } from "utils/hooks/bind";
import { FontSizeContext, FontSizeContextState } from "./ContextCollection";
import ReactComponent from "utils/classes/ReactComponent";

export { FontSizeContext };

export interface FontSizeContextState {
  fontSize: number;
  min: number;
  max: number;
  step: number;
}

export interface FontSizeContextStateWithActions extends FontSizeContextState {
  setFontSize: (rem: number) => void;
}

class FontSizeContextProvider extends ReactComponent<PropsWithChildren, FontSizeContextState> implements BindMethods {
  state: Readonly<FontSizeContextState> = {
    ...FontSizeContextState,
  };

  methods: BindItem[] = [
    { func: this.setFontSize, context: this },
    { func: this.updateMaxFontSize, context: this },
  ];

  constructor(props: PropsWithChildren) {
    super(props);
    autoBindMethods(this);
  }

  render(): ReactNode {
    return (
      <FontSizeContext.Provider value={{
        ...this.state,
        setFontSize: this.setFontSize,
      }}>
        {this.props.children}
      </FontSizeContext.Provider>
    );
  }

  componentDidMount(): void {
    this.updateMaxFontSize();
    window.addEventListener("resize", this.updateMaxFontSize, { signal: this.controller.signal });
  }

  updateMaxFontSize(): void {
    this.setState(prevState => {
      let max: number;
      let fontSize: number;

      if (window.innerWidth <= 1280) max = 4;
      else if (window.innerWidth <= 1920) max = 6;
      else max = 8;

      if (prevState.fontSize > max) {
        fontSize = max;
      }

      return fontSize
        ? { ...prevState, fontSize, max }
        : { ...prevState, max };
    });
  }

  setFontSize(rem: number): void {
    this.setState(prevState => ({
      ...prevState,
      fontSize: rem,
    }));
  }
}

export default FontSizeContextProvider;
