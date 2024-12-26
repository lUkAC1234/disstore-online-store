import { debounce } from "utils/hooks/debounce";

export interface FetchWorkerOptions<T_Response_Data> {
  url: string;
  onLoading?: () => void;
  onSuccess?: (response: {
    success?: boolean;
    data?: T_Response_Data;
    error?: string;
  }) => void;
  onError?: (err: string) => void;
}

class FetchWorker<T_Response_Data = unknown> {
  public response: {
    success?: boolean;
    data?: T_Response_Data;
    error?: string;
  };
  public loading: boolean;
  public url: string;
  private worker: Worker;
  private onLoading: () => void;
  private onSuccess: (response: {
    success?: boolean;
    data?: T_Response_Data;
    error?: string;
  }) => void;
  private onError: (err: string) => void;

  constructor(options: FetchWorkerOptions<T_Response_Data>) {
    const {
      url,
      onLoading,
      onSuccess,
      onError,
    } = options;

    this.onLoading = onLoading;
    this.onSuccess = onSuccess;
    this.onError = onError;

    this.url = url;
    this.worker = new Worker(new URL("../workers/fetch.worker", import.meta.url));
    this.worker.onmessage = this.onMessageHandler.bind(this);
  }

  public fetchData = debounce((url?: string): void => {
    this.loading = true;
    if (this.onLoading) {
      this.onLoading();
    }
    this.worker.postMessage({ url: url ?? this.url });
  }, 300);

  public terminate(): void {
    this.worker.terminate();
  }

  private onMessageHandler(evt: MessageEvent): void {
    try {
      const data: { success: boolean, data?: T_Response_Data, error?: string } = evt.data;

      if (data.success) {
        this.response = data;
        this.onSuccess(this.response);
      } else {
        this.response = null;
        this.onError(data.error);
      }

      this.loading = false;
    } catch (err) {
      console.error(err);
    }
  }
}

export default FetchWorker;
