import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ClerkApp, ClerkCatchBoundary, useUser } from "@clerk/remix";
import { Header } from "./components/header";
import { KollaSDKProvider } from "@kolla/react-sdk";
import type { ConsumerTokenResponse } from "./models/kolla.server";
import { useEffect, useState } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export const CatchBoundary = ClerkCatchBoundary();
function App() {
  const { user } = useUser();
  const [consumerToken, setConsumerToken] = useState<ConsumerTokenResponse>();
  useEffect(() => {
    if (user?.id) {
      const body = {
        consumer_id: user.id,
        metadata: {
          username: user?.fullName ?? "",
          email: user?.primaryEmailAddress?.emailAddress ?? "",
        },
      };
      fetch("/api/kolla-consumer", {
        credentials: "include",
        method: "POST",
        body: JSON.stringify(body),
      })
        .then((resp) => resp.json())
        .then((data) => setConsumerToken(data));
    }
  }, [user]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <KollaSDKProvider token={consumerToken?.token}>
          <div
            className="bg-gray-900 min-h-screen"
            style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
          >
            <Header />
            <main>
              <Outlet />
            </main>
          </div>
        </KollaSDKProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
export default ClerkApp(App);
