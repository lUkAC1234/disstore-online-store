import { KeyboardEvent } from "react";

const escapeKeyHandler = <T extends KeyboardEvent>(callback: () => void, event: T): void => {
  if (event.key === "Escape") {
    callback();
  }
};

const escapeKeyHandlerWindow = (callback: () => void, event: KeyboardEvent): void => {
  escapeKeyHandler<KeyboardEvent>(callback, event);
};

const escapeKeyHandlerReact = (callback: () => void, event: KeyboardEvent): void => {
  escapeKeyHandler<KeyboardEvent>(callback, event);
};

export {
  escapeKeyHandlerWindow,
  escapeKeyHandlerReact
};
