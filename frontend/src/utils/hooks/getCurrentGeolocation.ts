export function getCurrentLocation(successCallback: PositionCallback, errorCallback: PositionErrorCallback, options?: PositionOptions, init?: {
  useHttps?: boolean;
  alertMessage?: string;
  useHttpsErroCallback?: () => void;
}): void {
  if (init && init.useHttps) {
    if (location.protocol === "http:") {
      alert(init?.alertMessage ?? "Please use https protocol to get your location.");
      return;
    }
  }

  const geolocation: Geolocation = navigator.geolocation;
  geolocation.getCurrentPosition(successCallback, errorCallback, options);
}
