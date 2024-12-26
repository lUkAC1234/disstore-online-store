import { setCustomInterval, setCustomTimeout } from "utils/hooks/customNativeFns";

declare global {
  type ModalComponentCollection =
    | "AboutProject"
    | "Complain"
    | "Contacts"
    | "Volunteers"
    | "PrivacyPolicy";

  type SetTimeout = ReturnType<typeof setTimeout> | null;
  type SetInterval = ReturnType<typeof setInterval> | null;
  type CustomInterval = ReturnType<typeof setCustomInterval> | null;
  type CustomTimeout = ReturnType<typeof setCustomTimeout> | null;

  interface ClassNameExtenderProps {
    className?: string;
  }

  interface HasErrorState {
    error?: string;
    errorInfo?: string;
  }

  type BindItem = {
    func: (...args: unknown[]) => unknown;
    context: unknown;
    args?: unknown[];
  }

  interface BindMethods {
    methods: BindItem[];
  }
}

export {}
