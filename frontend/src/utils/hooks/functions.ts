type TypeOfChecker =
  | "bigint"
  | "boolean"
  | "function"
  | "number"
  | "object"
  | "string"
  | "symbol"
  | "undefined";

function typeChecker(value: unknown, type: TypeOfChecker) {
  return typeof value === type ? true : false;
}

function isBigint(value: unknown): boolean {
  return typeChecker(value, "bigint");
}

function isBool(value: unknown): boolean {
  return typeChecker(value, "boolean");
}

function isFunction(value: unknown): boolean {
  return typeChecker(value, "function");
}

function isNumber(value: unknown): boolean {
  return typeChecker(value, "number");
}

function isObject(value: unknown): boolean {
  return typeChecker(value, "object");
}

function isString(value: unknown): boolean {
  return typeChecker(value, "string");
}

function isSymbol(value: unknown): boolean {
  return typeChecker(value, "symbol");
}

function isUndefined(value: unknown): boolean {
  return typeChecker(value, "undefined");
}

function isNull(value: unknown): boolean {
  return value !== null ? false : true;
}

function isMap(value: unknown): boolean {
  return (value instanceof Map) ? true : false;
}

function isSet(value: unknown): boolean {
  return (value instanceof Set) ? true : false;
}

function isWeakMap(value: unknown): boolean {
  return (value instanceof WeakMap) ? true : false;
}

function isWeakSet(value: unknown): boolean {
  return (value instanceof WeakSet) ? true : false;
}

export {
  isBigint,
  isBool,
  isFunction,
  isNumber,
  isObject,
  isString,
  isSymbol,
  isUndefined,
  isNull,
  isMap,
  isSet,
  isWeakMap,
  isWeakSet,
};
