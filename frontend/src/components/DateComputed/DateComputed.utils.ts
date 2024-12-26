function putZero(input: number): string {
  if (input < 10) {
    return `0${input}`;
  }
  return input.toString();
}

export {
  putZero,
};
