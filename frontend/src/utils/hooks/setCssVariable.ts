import uniqueIdGenerator from "./uniqueIdGenerator";

const id: string = uniqueIdGenerator(20);
let styleElementIsCreated: boolean = false;

export default function setCssVariable(variableName: string, value: string): void {
  const styles: string = `
    :root {
      ${variableName}: ${value};
    }
  `;

  if (styleElementIsCreated) {
    const styleElementSelected: HTMLStyleElement = document.querySelector(`style#ST${id}`);
    if (!styleElementSelected) return;

    styleElementSelected.textContent = styles;
    return;
  }

  const styleElement: HTMLStyleElement = document.createElement("style");
  styleElement.id = `ST${id}`;
  styleElement.textContent = styles;

  if (!styleElementIsCreated) {
    document.head.appendChild(styleElement);
    styleElementIsCreated = true;
  }
}
