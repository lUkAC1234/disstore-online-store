import ApiRequest from "./apiRequest";

Promise
  .allSettled([
    ApiRequest.makeRequest("/news/2"),
    ApiRequest.makeRequest("/news/1"),
    ApiRequest.makeRequest("/news"),
  ])
  .then((results) => console.log(results))
  .catch((err) => console.error(err))
  .finally(() => console.log("Finally..."))
;
