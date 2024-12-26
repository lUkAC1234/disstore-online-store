import debug from "constants/debug";
import { ErrorInfo } from "react";

export function componentDidCatch(error: Error, errorInfo: ErrorInfo, callback?: () => void) {
  if (debug) {
    console.error(error, errorInfo);

    if (callback) {
      callback();
    }
  }
}

export function componentDidUpdate<T_Prev_Props, T_Prev_State>(
  prevProps: T_Prev_Props,
  prevState: T_Prev_State,
  snapshot?: unknown,
  callback?: (
    prevProps: T_Prev_Props,
    prevState: T_Prev_State,
    snapshot?: unknown
  ) => void
) {
  if (callback) {
    callback(prevProps, prevState, snapshot);
  }
}
