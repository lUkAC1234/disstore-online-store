export function setCustomInterval(callback: () => void, delay: number, controller?: AbortController): {
  cancel: () => void;
  ref: SetInterval;
} {
  const intervalRef: SetInterval = setInterval(callback, delay);
  const signal: AbortSignal = controller?.signal;

  const cancelInterval = (): void => clearInterval(intervalRef);
  if (signal) {
    signal.addEventListener("abort", cancelInterval);
  }

  return {
    cancel: cancelInterval,
    ref: intervalRef,
  };
}

export function setCustomTimeout(callback: () => void, delay: number, controller?: AbortController) {
  const timeoutRef: SetTimeout = setTimeout(callback, delay);
  const signal: AbortSignal = controller?.signal;

  const cancelTimeout = (): void => clearTimeout(timeoutRef);
  if (signal) {
    signal.addEventListener("abort", cancelTimeout);
  }

  return {
    cancel: cancelTimeout,
    ref: timeoutRef,
  };
}
