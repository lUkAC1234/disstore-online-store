// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.onmessage = async (evt: any) => {
  const url = evt.data.url;

  try {
    const response: Response = await fetch(url);
    if (!response.ok) {
      throw new Error("Fetching " + url + " was unsuccessful, STATUS_CODE: " + response.status);
    }

    const data: unknown = await response.json();
    self.postMessage({ success: true, data });
  } catch (err) {
    self.postMessage({ success: false, error: err.message });
  }
}
