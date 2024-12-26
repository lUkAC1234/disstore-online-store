/* eslint-disable @typescript-eslint/no-explicit-any */
import { PureComponent, ReactNode } from "react";

interface InjectOptions<T> {
  services?: any[];
  template?: (context: T) => ReactNode;
  templates?: (context: T) => object;
}

type ClassConstructor<T = unknown> = new (...args: unknown[]) => T;
type InjectableService = { service: ClassConstructor; alias?: string };

export function InjectServices(services: InjectableService[]): (constructor: any) => void {
  return function (constructor) {
    services.forEach(({ service, alias }) => {
      const serviceInstance = new service();
      const propertyName = alias || service.name.toLowerCase();

      Object.defineProperty(constructor.prototype, propertyName, {
        get() {
          return serviceInstance;
        },
        enumerable: true,
        configurable: false,
      });
    });
  };
}

export function INJECT_COMPONENTS<T = object>(context: T, services: ClassConstructor[]): void {
  services?.forEach((basector) => {
    const instance = new basector();
    Object.getOwnPropertyNames(instance).forEach((key) => {
      context[key] = instance[key];
    });
  });

  services?.forEach((basector) => {
    Object.getOwnPropertyNames(basector.prototype).forEach((name) => {
      Object.defineProperty(
        context,
        name,
        Object.getOwnPropertyDescriptor(basector.prototype, name) || Object.create(null),
      );
    });
  });
}

export function Component<T>(options: InjectOptions<T>): (constructor: any) => void {
  return COMPONENT(options);
}

export function COMPONENT<T>(options: InjectOptions<T>): (constructor: any) => void {
  return function(constructor: any): void {
    options?.services?.forEach((baseCtor) => {
      const instance = new baseCtor();
      Object.getOwnPropertyNames(instance).forEach((key) => {
        (constructor.prototype as any)[key] = instance[key];
      });
    });

    options?.services?.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        Object.defineProperty(
          constructor.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null),
        );
      });
    });

    Object.defineProperty(constructor.prototype, "services", {
      value: new Map<string, () => void>(),
    });

    if (constructor.prototype.observeServiceCleanups) {
      constructor.prototype.observeServiceCleanups.bind(constructor.prototype)();
    }

    if (options?.template) {
      Object.defineProperty(
        constructor.prototype,
        "render",
        {
          value() {
            return options?.template(this);
          },
          enumerable: true,
          configurable: false,
        }
      );
    }

    if (options?.templates) {
      Object.defineProperty(
        constructor.prototype,
        "templates",
        {
          get() {
            return options?.templates(this);
          },
          enumerable: true,
          configurable: false,
        }
      );
    }
  }
}

export function Injectable(constructors: any[]) {
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

export function Mixin<P = object, S = object, SS = any>(constructors: ClassConstructor[]) {
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
