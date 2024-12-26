export default function handleAppOverflow(makeHidden: boolean): void {
  const appRef: HTMLDivElement = document.querySelector("#app");
  if (makeHidden) {
    appRef.style.overflow = "hidden";
  } else {
    appRef.style.overflow = "";
  }
}
