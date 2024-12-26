export function convertStringBoolValue(value: string): boolean {
  switch (value) {
    case "false": return false;
    case "true": return true;
  }
}
