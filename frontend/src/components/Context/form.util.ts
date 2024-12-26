import { Component, PureComponent } from "react";

export function setFormItem<T_Context extends Component | PureComponent, T_Keys, T_Val>(
  context: T_Context,
  key: keyof T_Keys,
  value: T_Val
): void {
  context.setState(prevState => ({
    ...prevState,
    [key]: value,
  }));
}
