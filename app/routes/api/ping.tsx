import { LoaderFunction, json } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return json({ hi: "ho" });
};
