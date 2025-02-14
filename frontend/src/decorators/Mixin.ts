/* eslint-disable @typescript-eslint/no-explicit-any */
import { PureComponent } from "react";

function Mixin<P = object, S = object, SS = any>(constructors: ClassConstructor[]) {
  class Wrapper extends PureComponent<P, S, SS> {
    constructor(props: P) {
      super(props);
      constructors.forEach((baseCtor) => {
        const instance = new baseCtor();
        Object.getOwnPropertyNames(instance).forEach((key) => {
          (this as any)[key] = instance[key];
        });
      });
    }
  }

  constructors.forEach((baseCtor: any) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      if (name !== "constructor") {
        Object.defineProperty(
          Wrapper.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null)
        );
      }
    });
  });

  return Wrapper;
}

export { Mixin };
