export namespace StringUtils {
  export function capitalizeLetter(text: string): string {
    const firstLetter: string = text[0].toUpperCase();
    const rest: string = text.replace(text[0], "");
    const result: string = firstLetter + rest;
    return result;
  }
}

