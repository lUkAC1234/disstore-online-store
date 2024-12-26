import { ComponentType, ForwardedRef, forwardRef, ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from "react";

export const withRef = <P, R>(
  Component: ComponentType<P>
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<R>> => {
  return forwardRef<R, P>((props, ref: ForwardedRef<R>) => (
    <Component ref={ref} {...(props as P)} />
  ));
};
