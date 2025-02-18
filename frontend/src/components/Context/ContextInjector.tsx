import { ComponentType, Context, PureComponent, ReactNode, RefObject } from "react";

export function withContext<C, T>(ContextWrapper: Context<C>, WrappedComponent: ComponentType<T>): ComponentType<Omit<T, keyof C> & { ref?: RefObject<unknown> }> {
  class WithContextComponent extends PureComponent<Omit<T, keyof C> & { ref?: RefObject<unknown> }> {
    render(): ReactNode {
      return (
        <ContextWrapper.Consumer>
          {(contextValue: C) =>
            <WrappedComponent
              {...(this.props as T)}
              {...contextValue}
            />
          }
        </ContextWrapper.Consumer>
      );
    }
  }

  return WithContextComponent;
}

export function withContextSelector<C, T, SelectedProps>(
  ContextWrapper: Context<C>,
  WrappedComponent: ComponentType<T>,
  selector?: (context: C) => SelectedProps
): ComponentType<Omit<T, keyof SelectedProps> & { ref?: RefObject<unknown> }> {

  class WithContextComponent extends PureComponent<Omit<T, keyof SelectedProps> & { ref?: RefObject<unknown> }> {
    render(): ReactNode {
      return (
        <ContextWrapper.Consumer>
          {(contextValue: C) => {
            if (!selector) {
              return <WrappedComponent {...(this.props as T)} {...contextValue} />;
            }
            const selectedProps = selector(contextValue); 
            return <WrappedComponent {...(this.props as T)} {...selectedProps} />;
          }}
        </ContextWrapper.Consumer>
      );
    }
  }

  return WithContextComponent;
}
