const disableReactDevTools = () => {
  // @ts-expect-error any
  if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") {
    // @ts-expect-error any
    for (const prop in window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      // @ts-expect-error any
      if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__[prop] === "function") {
        // @ts-expect-error any
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__[prop] = () => {};
      }
    }
  }
};

export default disableReactDevTools;
