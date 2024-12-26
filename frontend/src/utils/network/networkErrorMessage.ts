export const networkErrorMessage = (message?: string, statusCode?: number) => {
  if (message) {
    return message + (statusCode ? ". STATUS_CODE: " + statusCode : "");
  }
  return "Failed to fetch data!";
}
