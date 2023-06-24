import type { V2_MetaFunction } from "@remix-run/node";
import { SignedIn, SignedOut } from "@clerk/remix";

import { Jumbo } from "~/components/jumbo";
import { useKollaEvents, useKollaSDK } from "@kolla/react-sdk";
import { useEffect, useState } from "react";

import { IntegrationCard } from "~/components/integartion.card";
export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

export default function Index() {
  const sdk = useKollaSDK();
  const { authenticated } = useKollaEvents();
  const [connectors, setConnectors] = useState<
    AsyncReturnType<typeof sdk.getConnectors>
  >([]);

  useEffect(() => {
    if (authenticated) {
      sdk.getConnectors().then((data) => setConnectors(data));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);
  return (
    <>
      <SignedIn>
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex flex-wrap -mx-1 lg:-mx-4">
            {connectors?.map((connector) => (
              <div
                key={connector.connector_id}
                className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3"
              >
                <IntegrationCard {...connector} />
              </div>
            ))}
            {(connectors?.length ?? 0) > 0 && (
              <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
                <IntegrationCard display_name="More coming soon" />
              </div>
            )}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="pt-24 max-w-4xl m-auto ">
          <img src="/assets/logo/secondary.png" />
        </div>
      </SignedOut>
      <Jumbo />
    </>
  );
}
