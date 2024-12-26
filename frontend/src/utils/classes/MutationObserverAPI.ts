class MutationObserverAPI extends MutationObserver {
  private controller: AbortController;

  constructor(callback: MutationCallback, controller?: AbortController) {
    super(callback);
    this.attachController(controller);
  }

  private attachController(controller: AbortController): void {
    this.controller = controller;
    if (this.controller) {
      this.controller.signal.addEventListener("abort", this.onAbort);
    }
  }

  private onAbort = (): void => {
    this.disconnect();
  }
}

export default MutationObserverAPI;
