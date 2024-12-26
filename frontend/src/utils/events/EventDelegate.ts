function eventDelegate(ref: object, propKey: string | string[], eventName: string): void {
  const event: CustomEvent = new CustomEvent(eventName, {
    detail: {
      value: ref,
    },
  });

  function dispatchEvent() {
    window.dispatchEvent(event);
  }

  if (!Array.isArray(propKey)) {
    const symbol = Symbol(propKey);
    Object.defineProperty(ref, propKey, {
      get() {
        return this[symbol];
      },
      set(value) {
        if (this[symbol] !== value) {
          this[symbol] = value;
          dispatchEvent();
        }
      },
    });
  } else {
    const symbolCollection: Map<string, unknown> = new Map();

    for (const key of propKey) {
      symbolCollection.set(key, ref[key]);
    }

    for (const [key] of symbolCollection.entries()) {
      const symbol = Symbol(key);
      Object.defineProperty(ref, symbol, {
        get() {
          return this[symbol];
        },
        set(newValue) {
          if (this[symbol] !== newValue) {
            this[symbol] = newValue;
            dispatchEvent();
          }
        }
      });
    }
  }
}

export default eventDelegate;
