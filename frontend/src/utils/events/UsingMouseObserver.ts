import { bind } from "utils/hooks/bind";

class UsingMouseObserverAPI {
  constructor() {
    bind(this.onWindowClickHandler, this);
    bind(this.onTabKeydownHandler, this);
  }

  public observe(): void {
    this.manageEvents("addEventListener");
  }

  public unobserve(): void {
    this.manageEvents("removeEventListener");
  }

  private manageEvents(action: "addEventListener" | "removeEventListener"): void {
    window[action]("keydown", this.onTabKeydownHandler);
    window[action]("click", this.onWindowClickHandler);
    // window[action]("mousemove", this.onWindowClickHandler);
  }

  private onWindowClickHandler(): void {
    this.setOrRemoveUsingMouse(true);
  }

  private onTabKeydownHandler(evt: KeyboardEvent): void {
    if (evt.key === "Tab") {
      this.setOrRemoveUsingMouse(false);
    }
  }

  private setOrRemoveUsingMouse(set: boolean): void {
    if (set) {
      document.body.classList.add("using-mouse");
    } else {
      document.body.classList.remove("using-mouse");
    }
  }
}

export default UsingMouseObserverAPI;
