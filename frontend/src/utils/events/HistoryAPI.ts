import debug from "constants/debug";

class HistoryAPI {
  private static originalReplaceState = history.replaceState.bind(history);
  private static originalPushState = history.pushState.bind(history);

  private static dispatchHistoryEvent(eventType: string): void {
    const event: CustomEvent = new CustomEvent(eventType, { detail: window.location });
    window.dispatchEvent(event);
  }

  public setupAutoScrollRestoration(): HistoryAPI {
    history.scrollRestoration = "auto";
    if (debug) {
      console.log("History API, scroll restoration is enabled");
    }
    return this;
  }

  public setupEventDispatchers(): HistoryAPI {
    history.pushState = this.pushState;
    history.replaceState = this.replaceState;

    return this;
  }

  private pushState(data: unknown, unused: string, url?: string | URL | null): void {
    HistoryAPI.originalPushState(data, unused, url);
    HistoryAPI.dispatchHistoryEvent("pushstate");
  }

  private replaceState(data: unknown, unused: string, url?: string | URL | null): void {
    HistoryAPI.originalReplaceState(data, unused, url);
    HistoryAPI.dispatchHistoryEvent("replacestate");
  }

  public setupLogger(): HistoryAPI {
    window.addEventListener("pushstate", (evt: CustomEvent) => this.logState("PushState event triggered", evt));
    window.addEventListener("replacestate", (evt: CustomEvent) => this.logState("ReplaceState event triggered", evt));
    window.addEventListener("popstate", (evt: PopStateEvent) => this.logState("PopState event triggered", evt));

    return this;
  }

  private logState(message: string, event: CustomEvent | PopStateEvent): void {
    console.log(message, event);
  }
}

export default HistoryAPI;
