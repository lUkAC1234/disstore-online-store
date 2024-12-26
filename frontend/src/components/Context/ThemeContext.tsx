import { PropsWithChildren, PureComponent, ReactNode } from "react";
import { ThemeContext } from "./ContextCollection";

export { ThemeContext };

export type ThemeColor =
  | "default"
  | "grey"
  | "dark";

export interface ThemeContextProps extends PropsWithChildren {}

export interface ThemeContextState {
  theme: ThemeColor;
}

export interface ThemeContextStateWithActions extends ThemeContextState {
  setThemeColor: (theme: ThemeColor) => void;
}

class ThemeContextProvider extends PureComponent<ThemeContextProps, ThemeContextState> {
  state: Readonly<ThemeContextState> = {
    theme: "default",
  };

  render(): ReactNode {
    return (
      <ThemeContext.Provider
        value={{
          ...this.state,
          setThemeColor: this.setThemeColor,
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }

  componentDidMount(): void {
    this.attachTheme();
  }

  componentDidUpdate(_prevProps: Readonly<ThemeContextProps>, prevState: Readonly<ThemeContextState>): void {
    if (prevState.theme !== this.state.theme) {
      this.attachTheme();
    }
  }

  setThemeColor = (theme: ThemeColor): void => {
    this.setState({ theme });
  }

  attachTheme(): void {
    const body = document.body;

    switch (this.state.theme) {
      case "default":
        body.classList.remove("theme-grey");
        body.classList.remove("theme-dark");
        body.classList.add("theme-default");
        break;
      case "grey":
        body.classList.remove("theme-default");
        body.classList.remove("theme-dark");
        body.classList.add("theme-grey");
        break;
      case "dark":
        body.classList.remove("theme-grey");
        body.classList.remove("theme-default");
        body.classList.add("theme-dark");
        break;
    }
  }

  removeClasses(): void {
    const body = document.body;
    body.classList.remove("theme-grey");
    body.classList.remove("theme-default");
    body.classList.remove("theme-dark");
  }
}

export default ThemeContextProvider;
