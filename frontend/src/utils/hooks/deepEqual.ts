export default function deepEqual(
  obj1: unknown,
  obj2: unknown,
  visited = new Set()
) {
  // Base cases for primitive values and null/undefined
  if (obj1 === obj2) return true;
  if (
    obj1 === null ||
    obj2 === null ||
    typeof obj1 !== "object" ||
    typeof obj2 !== "object"
  )
    return false;

  // Check for cyclic references
  if (visited.has(obj1) || visited.has(obj2)) return false;
  visited.add(obj1);
  visited.add(obj2);

  // Handle arrays and objects differently
  if (Array.isArray(obj1)) {
    if (!Array.isArray(obj2) || obj1.length !== obj2.length) return false;
    return obj1.every((item, index) => deepEqual(item, obj2[index], visited));
  } else {
    // Compare object keys
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;

    // Recursively compare each property
    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key], visited)) {
        return false;
      }
    }
  }

  // Cleanup visited set to prevent memory leaks
  visited.delete(obj1);
  visited.delete(obj2);

  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deep(a: any, b: any): boolean {
  if (a === b) return true;

  if (a && b && typeof a == "object" && typeof b == "object") {
    if (a.constructor !== b.constructor) return false;

    let length: number, i: number;

    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!deep(a[i], b[i])) return false;
      return true;
    }

    if (a.constructor === RegExp)
      return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf)
      return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString)
      return a.toString() === b.toString();

    const keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0; ) {
      const key = keys[i];
      const valueA = a[key];
      const valueB = b[key];

      // Special handling for functions
      if (typeof valueA === 'function' && typeof valueB === 'function') {
        if (valueA.toString() !== valueB.toString()) return false;
      } else if (!deep(valueA, valueB)) {
        return false;
      }
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
}
