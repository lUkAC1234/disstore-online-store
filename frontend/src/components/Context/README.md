# React - Usage of Context API

So, this is just illustration of simple implementation of using Context API in your React app. In this example, I am using class components to share state across components. Below code shows basic implementation of context using class as Provider:

```tsx
import { Component, ReactNode, createContext } from "react";

export interface InputTextFieldContext {
  text: string;
  setText: (text: string) => void;
}

export const InputTextField = createContext<InputTextFieldContext>({
   text: "", // Empty default field
   setText: () => {},  // Empty default function
});

/* Provider component for the InputTextField context */

interface InputTextFieldProviderProps {
  children?: ReactNode;
}

interface InputTextFieldProviderState {
  text?: string;
}

export default class InputTextFieldProvider extends Component<InputTextFieldProviderProps, InputTextFieldProviderState> {
  state: Readonly<InputTextFieldProviderState> = {
    text: ""
  };

  constructor(props: InputTextFieldProviderProps) {
    super(props);
    bind(this.setText, this);
  }

  render(): ReactNode {
    return (
      <InputTextField.Provider value={{
        text: this.state.text,
        setText: this.setText
      }}>
        {this.props.children}
      </InputTextField.Provider>
    );
  }

  private setText(text: string): void {
    this.setState({ text });
  }
}
```

As you can see, we create context first and assign it as constant variable with its empty default parameters, in our case getter and setter -> text field and setText method.

Moreover, we created InputTextFieldProvider class component that handles state of the InputTextField context.

## Using context state in other wrapped components, and also mutating state of context from any component that is inside InputTextFieldProvider component.

Well, in this section, I am going to show how to use context in other wrapped components, I am using class components only:

```tsx
class TextField extends Component {
  static contextType?: Context<InputTextFieldContext> = InputTextField;
  context!: ContextType<typeof InputTextField>;

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  render(): ReactNode {
    return (
      <input
        type="text"
        value={this.context?.text}
        onChange={this.handleChange}
      />
    );
  }

  private handleChange(evt: FormEvent<HTMLInputElement>): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const value: string = target.value;
    this.context.setText(value);
  }
}
```

Well, this is it, that's all you need to know the basics of creating context in React using class components.
