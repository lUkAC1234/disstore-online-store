export function bind<T extends (...args: unknown[]) => unknown>(func: T, context: unknown): void;
export function bind<T extends (...args: unknown[]) => unknown>(func: T, context: unknown, ...args: Parameters<T>): void;
export function bind<T extends (...args: unknown[]) => unknown>(func: T, context: unknown, ...args: unknown[]): void {
  (context as unknown)[func.name] = func.bind(context, ...args);
}

export function bindReturn<T extends (...args: unknown[]) => unknown>(func: T, context: unknown): T;
export function bindReturn<T extends (...args: unknown[]) => unknown>(func: T, context: unknown, ...args: Parameters<T>): T;
export function bindReturn<T extends (...args: unknown[]) => unknown>(func: T, context: unknown, ...args: unknown[]): T {
  return func.bind(context, ...args) as T;
}

/**
 * @description
 * This method bind methods by applying list of methods for binding
 *
 * @param {BindItem[]} list List of methods
 */
export function bindMethods<T>(list: BindItem[]): void {
  for (const item of list) {
    const { func, context, args } = item;
    if (args && args.length > 0) {
      (context as T)[func.name] = func.bind(context, ...args);
    } else {
      (context as T)[func.name] = func.bind(context);
    }
  }
}

/**
 * @description
 * This method automatically reveals methods variable in your class if defined and binds methods for you.
 *
 * @param {T} context This context of your class.
 */
export function autoBindMethods<T>(context: T): void {
  try {
    const methodsRef: BindItem[] = context["methods"] as BindItem[];

    if (!methodsRef) {
      throw new TypeError("Couldn't find 'methods' variable in your class component!");
    }

    bindMethods(methodsRef);
  } catch (err) {
    console.error(err);
  }
}

class Bind {
  static bind = bind;
  static bindReturn = bindReturn;
  static bindMethods = bindMethods;
  static autoBindMethods = autoBindMethods;
}

export default Bind;
