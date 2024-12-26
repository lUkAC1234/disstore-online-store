/* eslint-disable @typescript-eslint/ban-types */

const debounceRegistry = new WeakMap<Function, AbortSignal>();

export function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number, controller?: AbortController): T & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debouncedFunction = (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };

  const cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  debouncedFunction.cancel = cancel;

  if (controller) {
    const signal: AbortSignal = controller.signal;

    if (!debounceRegistry.has(func)) {
      signal.addEventListener("abort", cancel);
      debounceRegistry.set(func, signal); // Record the function-signal association
    }
  }

  return debouncedFunction as T & { cancel: () => void };
}


const debounceRegistryForCancellableDebounce: WeakMap<Function, AbortSignal> = new WeakMap();

export function cancellableDebounce<T extends (...args: unknown[]) => void>(func: T, wait: number, abortController?: AbortController) {
  let timeout: SetTimeout = null;

  const cancel = (): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
  }

  const start = (...args: Parameters<T>): void => {
    cancel();

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  }

  if (abortController && !debounceRegistryForCancellableDebounce.has(func)) {
    abortController.signal.addEventListener("abort", cancel);
    debounceRegistryForCancellableDebounce.set(func, abortController.signal);
  }

  return { start, cancel };
}


export class Debounce {
  private timeout: SetTimeout;
  private func: (...args: unknown[]) => void;
  private wait: number;
  private abortController: AbortController;

  private static debounceRegistry: WeakMap<Function, AbortSignal> = new WeakMap();

  public get timeoutRef(): SetTimeout {
    return this.timeout;
  }

  constructor(func: (...args: unknown[]) => void, wait: number, abortController?: AbortController) {
    this.func = func;
    this.wait = wait;
    this.abortController = abortController;

    if (!Debounce.debounceRegistry.has(this.func)) {
      this.abortController.signal.addEventListener("abort", () => this.cancel());
      Debounce.debounceRegistry.set(this.func, this.abortController.signal);
    }
  }

  public start(...args: unknown[]) {
    this.cancel();

    this.timeout = setTimeout(() => {
      this.func(...args);
    }, this.wait);
  }

  public cancel(): void {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
  }
}
