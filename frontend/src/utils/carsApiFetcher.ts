import { env } from "process";
import { paths } from "./carsApi.generated";
import { Fetcher } from "openapi-typescript-fetch";

export const carsApiFetcher = Fetcher.for<paths>();

carsApiFetcher.configure({
  baseUrl: "https://carapi.app",
  init: {
    headers: {},
  },
});

if (process.env.REACT_APP_API_TOKEN && process.env.REACT_APP_API_SECRET) {
  console.log("fetching jwt");
  carsApiFetcher
    .path("/api/auth/login")
    .method("post")
    .create()({
      api_token: process.env.REACT_APP_API_TOKEN,
      api_secret: process.env.REACT_APP_API_SECRET,
    })
    .then((resp) => console.log(resp, "jwt query resp"));
} else {
  console.error(
    process.env,
    "api secret not found. please set up your envirnment variables."
  );
}
