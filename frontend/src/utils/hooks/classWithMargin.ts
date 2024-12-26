export interface CSSMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export default function classWithMargin(className: string, margin: CSSMargin): string {
  let computedMargin: string = className;

  for (const [key, value] of Object.entries(margin)) {
    let marginClass: string = "";

    switch (key) {
      case "top":
        marginClass = "mt";
        break;
      case "bottom":
        marginClass = "mb";
        break;
      case "left":
        marginClass = "ml";
        break;
      case "right":
        marginClass = "mr";
        break;
    }

    computedMargin += ` ${marginClass}-${value}`;
  }

  return computedMargin;
}
