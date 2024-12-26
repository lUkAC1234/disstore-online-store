const classNameExtender = (original: string, additional?: string): string => {
  return (additional) ? original + " " + additional : original;
}

const classNameToggler = (className: string, activeClassName: string, toggleValue: boolean): string => {
  return (toggleValue) ? className + " " + activeClassName : className;
}

export {
  classNameExtender,
  classNameToggler
};
