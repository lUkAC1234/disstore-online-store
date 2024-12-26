import AttributesMap from "utils/collections/SignalAPI_AttributesMap";
import uniqueIdGenerator from "utils/hooks/uniqueIdGenerator";

export type Listener<T> = (newValue: T, oldValue: T) => void;

/**
 * Attributes that will be updated automatically whenever value of Signal changes.
 */
const attributesMap: Map<string, string> = AttributesMap;

export class SignalCollection {
  static signalCollection: Map<string, Signal<unknown>> = new Map<string, Signal<unknown>>();

  static getSignal(name: string): Signal<unknown> {
    const signal = this.signalCollection.get(name);
    if (!signal) {
      console.warn("Didn't find the signal with the id: " + name);
      return;
    }
    return signal;
  }

  static setSignal<T>(name: string, value: Signal<T>): void {
    if (this.signalCollection.has(name)) {
      console.warn("Already have signal record with the same id name: " + name);
      return;
    }

    this.signalCollection.set(name, value);
  }

  static removeSignal(name: string): void {
    this.signalCollection.delete(name);
  }

  static clearSignalCollection(): void {
    this.signalCollection.clear();
  }
}

/**
 * Signal API - which uses Signal as unique storage for getting, setting data, and synchronizing it in HTML, using regular DOM manipulations.
 * Underlying system is as easy as possible, it queries elements that have id's
 */
class Signal<T> {
  private static attributesMap: typeof attributesMap = attributesMap;

  private _value: T;
  private _oldValue: T;
  private listeners: Set<Listener<T>>;
  private refs: NodeListOf<HTMLElement>;

  public id: string;
  public name: string;

  public get value(): T {
    return this._value;
  }

  public set value(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.notify();
    }
  }

  private get oldValue(): T {
    return this._oldValue;
  }

  private set oldValue(value: T) {
    if (this._oldValue !== value) {
      this._oldValue = value;
    }
  }

  constructor(initialValue: T, signalName: string) {
    this.value = initialValue;
    this.oldValue = initialValue;
    this.name = signalName;
    this.listeners = new Set();
    this.id = "data-id" + uniqueIdGenerator(20);
    SignalCollection.setSignal(signalName, this);
  }

  public subscribe(listener: Listener<T>): void {
    this.listeners.add(listener);
  }

  public unsubscribe(listener: Listener<T>): void {
    this.listeners.delete(listener);
  }

  private notify(): void {
    try {
      if (this.listeners && this.listeners.size > 0) {
        this.listeners.forEach((listener) => listener(this.value, this.oldValue));
        this.oldValue = this.value;
      }
    } catch (err) {
      console.error(`Failed to notify listeners for signal: ${this.name}`, err);
    }

    try {
      this.updateDOM();
    } catch (err) {
      console.error(`Failed to update DOM for signal: ${this.name}`, err);
    }
  }

  private syncRefs(): void {
    this.refs = document.querySelectorAll(`[data-id="${this.id}"]`);
  }

  private updateDOM(): void {
    this.syncRefs();
    const value = this._value.toString();

    if (!this.refs) {
      throw new TypeError("Property refs is undefined, couldn't trigger signal update. Signal: " + this.name);
    }

    for (let i = 0; i < this.refs?.length; ++i) {
      const ref: HTMLElement = this.refs[i];

      if (ref.hasAttribute("ref-text")) {
        ref.textContent = value;
      } else if (ref.hasAttribute("ref-innerhtml")) {
        ref.innerHTML = value;
      }

      this.updateAttributes(ref, value);
    }
  }

  private updateAttributes(ref: HTMLElement, value: string): void {
    for (const [key, realDOMattr] of Signal.attributesMap.entries()) {
      const hasAttribute: boolean = ref.hasAttribute(key);

      if (hasAttribute) {
        switch (key) {
          case "ref-value":
            if (ref instanceof HTMLInputElement || ref instanceof HTMLTextAreaElement) {
              ref.setAttribute(realDOMattr, value);
              ref.value = value;
            }
            break;
          default:
            ref.setAttribute(realDOMattr, value);
            break;
        }
      }
    }
  }
}

export default Signal;
