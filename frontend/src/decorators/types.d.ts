declare global {
  interface InjectOptions<T> {
    services?: ClassConstructor[];
    template?: (context: T) => ReactNode;
    deep?: boolean;
    logComponent?: boolean;
  }

  type ClassConstructor<T = unknown> = new (...args: unknown[]) => T;
}

export {};
