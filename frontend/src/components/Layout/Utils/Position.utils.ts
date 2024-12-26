import { PureComponent } from "react";

export default function handleComponentPosition<T extends PureComponent>(context: T, stateKey: string) {
  context.setState((prevState: object) => {
    const pathnameList: string[] = location.pathname.split("/");
    let componentIsFixed: boolean = false;

    if (!pathnameList[2]) componentIsFixed = true;
    else componentIsFixed = false;

    return {
      ...prevState,
      [stateKey]: componentIsFixed,
    };
  });
}
