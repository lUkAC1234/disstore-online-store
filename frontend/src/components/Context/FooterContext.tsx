import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { FooterContext } from "./ContextCollection";

export { FooterContext };

export interface FooterContextProps extends PropsWithChildren {}
export interface FooterContextState {
  isFooterToggled: boolean;
  isFooterToggleBtnHidden: boolean;
}

export interface FooterContextStateWithActions extends FooterContextState {
  toggleFooter: (value: boolean, callback?: (value?: boolean) => void) => void;
  toggleVisibilityFooterToggleBtn: (value: boolean, callback?: (value?: boolean) => void) => void;
}

class FooterContextProvider extends PureComponent<FooterContextProps, FooterContextState> {
  state: Readonly<FooterContextState> = {
    isFooterToggled: false,
    isFooterToggleBtnHidden: false,
  };

  render(): ReactNode {
    return (
      <FooterContext.Provider
        value={{
          ...this.state,
          toggleFooter: this.toggleFooter,
          toggleVisibilityFooterToggleBtn: this.toggleVisibilityFooterToggleBtn,
        }}
      >
        {this.props.children}
      </FooterContext.Provider>
    );
  }

  stateSetter<T>(key: keyof FooterContextState, value: T, callback?: () => void): void {
    this.setState(prevState => ({
      ...prevState,
      [key]: value,
    }), () => {
      if (callback) callback();
    });
  }

  toggleFooter = (value: boolean, callback?: () => void): void => {
    this.stateSetter("isFooterToggled", value, callback);
  }

  toggleVisibilityFooterToggleBtn = (value: boolean, callback?: () => void): void => {
    this.stateSetter("isFooterToggleBtnHidden", value, callback);
  }
}

export default FooterContextProvider;
