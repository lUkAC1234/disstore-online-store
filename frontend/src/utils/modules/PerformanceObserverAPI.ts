import { bind } from "utils/hooks/bind";

class PerformanceObserverAPI {
  private loggerEnabled: boolean;
  private instance: PerformanceObserver;
  private instanceInit: PerformanceObserverInit;

  constructor(init?: PerformanceObserverInit) {
    bind(this.performanceObserverCallback, this);
    this.instanceInit = init;
    this.instance = new PerformanceObserver(this.performanceObserverCallback);
  }

  public observe(): PerformanceObserverAPI {
    this.instance.observe(this.instanceInit);
    return this;
  }

  public disconnect(): PerformanceObserverAPI {
    this.instance.disconnect();
    return this;
  }

  public takeRecords(): PerformanceEntryList {
    return this.instance.takeRecords();
  }

  public setupLogger(): PerformanceObserverAPI {
    this.loggerEnabled = true;
    return this;
  }

  private performanceObserverCallback(entries: PerformanceObserverEntryList, observer: PerformanceObserver): void {
    if (this.loggerEnabled) {
      console.group("PERFORMANCE LOG");
      console.table(entries);
      console.table(observer);
      console.groupEnd();
    }
  }
}

export default PerformanceObserverAPI;
