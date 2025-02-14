/* eslint-disable @typescript-eslint/no-explicit-any */

function Classes(constructors: any[]) {
  class Wrapper {
    constructor() {
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

export { Classes };
