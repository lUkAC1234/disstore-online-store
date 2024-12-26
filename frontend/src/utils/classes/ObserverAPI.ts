import { PureComponent } from "react";
import { deep } from "utils/hooks/deepEqual";

export type ObserverListener<T> = (newValue: T, oldValue: T) => void;

export class ObserverCollection {
  static collection: Map<string, Observer<unknown>> = new Map<string, Observer<unknown>>();

  static getObserver(name: string): Observer<unknown> {
    const observer = this.collection.get(name);
    if (!observer) {
      console.warn("Didn't find the observer with name: " + name);
      return;
    }
    return observer;
  }

  static setObserver<T>(name: string, value: Observer<T>): void {
    const hasRecord: boolean = this.collection.has(name);
    if (hasRecord) {
      console.warn("Already have observer record with the same id name: " + name);
      return;
    }
    this.collection.set(name, value);
  }

  static removeObserver(name: string): void {
    this.collection.delete(name);
  }

  static clearObserverCollection(): void {
    this.collection.clear();
  }
}

export class Observer<T> {
  private _value: T;
  private _oldValue: T;
  private listeners: Set<ObserverListener<T>>;
  private name: string;
  public deep: boolean;

  public get value(): T {
    return this._value;
  }

  public set value(newValue: T) {
    if (this._value !== newValue) {
      this.oldValue = this._value;
      this._value = newValue;
      this.notify();
    }
  }

  public get oldValue(): T {
    return this._oldValue;
  }

  private set oldValue(value: T) {
    if (this._oldValue !== value) {
      this._oldValue = value;
    }
  }

  constructor(initialValue: T, signalName: string) {
    if (typeof initialValue === "object") {
      this.deep = true;
      this.value = new Proxy(initialValue, {
        set: (target, key, newValue) => {
          try {
            const oldValue = target[key];
            if (target[key] !== null && !deep(oldValue, newValue)) {
              this.oldValue = target[key];
              target[key] = newValue;
              this.notify();
              return true;
            }
            return false;
          } catch (err) {
            console.error(err);
          }
        }
      });
    } else {
      this.value = initialValue;
    }
    this.oldValue = initialValue;
    this.name = signalName;
    this.listeners = new Set();
    ObserverCollection.setObserver(this.name, this);
  }

  public subscribe(listener: ObserverListener<T>): void {
    this.listeners.add(listener);
  }

  public unsubscribe(listener: ObserverListener<T>): void {
    this.listeners.delete(listener);
  }

  private notify(): void {
    try {
      if (this.listeners && this.listeners.size > 0) {
        console.log("NOTIFIED");
        this.listeners.forEach((listener) => listener(this.value, this.oldValue));
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export abstract class ObserverReactAPI<T> extends PureComponent<object, { value: T }> {
  observer: Observer<T>;

  state: Readonly<{ value: T; }> = {
    value: null,
  };

  private get hasObserver(): boolean {
    if (this.observer && this.observerCallback) {
      return true;
    }
  }

  componentDidMount(): void {
    if (this.hasObserver) {
      if (this.state.value !== this.observer.value) {
        this.setState({ value: this.observer?.value });
      }
      this.observer.subscribe(this.observerCallback);
    }
  }

  componentWillUnmount(): void {
    if (this.hasObserver) {
      this.observer.unsubscribe(this.observerCallback);
    }
  }

  observerCallback = (): void => {
    const { value, oldValue } = this.observer;
    console.log(!deep(value, oldValue));

    if (!deep(value, oldValue)) {
      console.log("UPDATED");
      this.setState({ value }, () => console.log(this.state));
    }
  }
}
