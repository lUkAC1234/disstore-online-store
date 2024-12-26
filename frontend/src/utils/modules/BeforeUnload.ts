class BeforeUnload {
  public addHandler(fn: (evt: BeforeUnloadEvent) => void): BeforeUnload {
    this.hookEvent(fn);
    return this;
  }

  private hookEvent(fn: (evt: BeforeUnloadEvent) => void): void {
    window.addEventListener("beforeunload", fn);
  }
}

export default BeforeUnload;
