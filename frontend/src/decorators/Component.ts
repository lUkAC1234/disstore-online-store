import { isEqual } from "lodash";
import { Component } from "react";

const serviceInstanceCache = new WeakMap<ClassConstructor, unknown>();

function COMPONENT<T>(options: InjectOptions<T>): (constructor: ClassConstructor) => void {
  return function (constructor: ClassConstructor): void {
    const prototype = constructor.prototype;

    options.services?.forEach((ServiceCtor) => {
      let instance = serviceInstanceCache.get(ServiceCtor);
      if (!instance) {
        instance = new ServiceCtor();
        serviceInstanceCache.set(ServiceCtor, instance);
      }

      Object.keys(instance).forEach((key) => {
        if (!(key in prototype)) {
          Object.defineProperty(prototype, key, {
            value: instance[key],
            writable: false, // Make it immutable
            enumerable: true,
            configurable: false,
          });
        } else {
          console.warn(`Property '${key}' on '${constructor.name}' is already defined and will not be overwritten.`);
        }
      });

      Object.getOwnPropertyNames(ServiceCtor.prototype).forEach((method) => {
        if (method !== "constructor" && !(method in prototype)) {
          Object.defineProperty(
            prototype,
            method,
            Object.getOwnPropertyDescriptor(ServiceCtor.prototype, method) || Object.create(null)
          );
        } else if (method !== "constructor") {
          console.warn(`Method '${method}' on '${constructor.name}' is already defined and will not be overwritten.`);
        }
      });
    });

    if (options.template) {
      if (!("render" in prototype)) {
        Object.defineProperty(prototype, "render", {
          value() {
            return options.template?.(this as T);
          },
          enumerable: true,
          configurable: false,
        });
      } else {
        console.warn(`Render method is already defined on '${constructor.name}' and will not be overwritten.`);
      }
    }

    if (options.deep) {
      if (prototype instanceof Component && !("shouldComponentUpdate" in prototype)) {
        Object.defineProperty(prototype, "shouldComponentUpdate", {
          value(nextProps: Readonly<object>, nextState: Readonly<object>) {
            return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
          },
          enumerable: true,
          configurable: false,
        });
      }
    }

    if (options.logComponent) {
      console.log(constructor.prototype);
    }
  };
}

export {
  COMPONENT,
  serviceInstanceCache,
};
