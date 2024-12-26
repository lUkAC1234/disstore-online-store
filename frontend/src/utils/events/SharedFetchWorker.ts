import FetchWorker from "../classes/FetchWorker";
import { debounce } from "../hooks/debounce";

export interface FetchWorkerEventNames {
  loadingEventType: string;
  successEventType: string;
  errorEventType: string;
}

/**
 * SharedFetchWorker - this class implements special logic for fetching data in other thread or worker
 * and share it across main thread through event system which was initially dispatched after creation
 * the instace of this class.
 *
 * It is better to set event type names for all states of fetching with unique ID,
 * if there are identical event names, it will lead to unexpected behavior and V8 will most probably override
 * event dispatchers.
 *
 * Here is the basic example:
 *
 * @example
 * const sharedFetchWorker = new SharedFetchWorker("https://api-green.tashkent.uz/ru/api/news", {
 *   loadingEventType: "loading-news-shared",
 *   successEventType: "success-news-shared",
 *   errorEventType: "error-news-shared",
 * });
 *
 * sharedFetchWorker.fetchData(); // trigger event listeners to share data across modules.
 *
 * window.addEventListener("loading-news-shared", (evt: CustomEvent) => console.log(evt.detail));
 * window.addEventListener("success-news-shared", (evt: CustomEvent) => console.log(evt.detail));
 * window.addEventListener("error-news-shared", (evt: CustomEvent) => console.log(evt.detail));
 */
class SharedFetchWorker<T> {
  private _url: string;
  public fetchWorker: FetchWorker<T>;

  public get url() {
    return this._url;
  }

  public set url(value: string) {
    this._url = value;
    this.fetchWorker.url = this._url;
  }

  constructor(url: string, options: FetchWorkerEventNames) {
    this._url = url;
    this.setupFetchWorker(options);
  }

  public fetchData: () => void = debounce(() => this.fetchWorker.fetchData(), 100);

  private setupFetchWorker(options: FetchWorkerEventNames): void {
    const { loadingEventType, successEventType, errorEventType } = options;

    this.fetchWorker = new FetchWorker<T>({
      url: this._url,
      onLoading: (): void => {
        this.dispatchLoadingIndication(loadingEventType);
      },
      onSuccess: (response): void => {
        this.dispatchSuccessResults(successEventType, response);
      },
      onError: (err: string): void => {
        this.dispatchErrorResult(errorEventType, err);
      }
    });
  }

  private dispatchLoadingIndication(eventType: string): void {
    const fetchEvent: CustomEvent = new CustomEvent(eventType, {
      detail: {
        success: false,
        loading: true,
        error: "",
      },
    });
    window.dispatchEvent(fetchEvent);
  }

  private dispatchSuccessResults<T>(eventType: string, response: T): void {
    const fetchEvent: CustomEvent = new CustomEvent(eventType, {
      detail: { ...response },
    });
    window.dispatchEvent(fetchEvent);
  }

  private dispatchErrorResult(eventType: string, err: string): void {
    const fetchEvent = new CustomEvent(eventType, {
      detail: {
        success: false,
        loading: false,
        error: err,
      },
    });
    window.dispatchEvent(fetchEvent);
  }
}

export default SharedFetchWorker;
