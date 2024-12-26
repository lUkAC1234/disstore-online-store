import { ComponentType, Context, ReactNode } from "react";

export function withContext<C, T>(
  ContextWrapper: Context<C>,
  WrappedComponent: ComponentType<T>
): ComponentType<Omit<T, keyof C>> {
  return function(props: Omit<T, keyof C>): ReactNode {
    return (
      <ContextWrapper.Consumer>
        {(contextValue: C) => (
          <WrappedComponent {...(props as T)} {...contextValue} />
        )}
      </ContextWrapper.Consumer>
    );
  }
}
