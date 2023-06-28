import type { V2_MetaFunction } from "@remix-run/node";


import { Jumbo } from "~/components/jumbo";
import { useKollaSDK } from "@kolla/react-sdk";
import { useEffect, useState } from "react";

import { IntegrationCard } from "~/components/integartion.card";
export const meta: V2_MetaFunction = () => {
  return [
    { title: "Harmony Hub" },
    { name: "description", content: "Productivity Unified" },
  ];
};
type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

export default function Index() {
  const sdk = useKollaSDK();
  const [connectors, setConnectors] = useState<
    AsyncReturnType<typeof sdk.getConnectors>
  >([]);

  useEffect(() => {
    if (sdk.programID) {
      sdk.getConnectors().then((data) => setConnectors(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdk.programID]);
  return (
    <>
      <div className="pt-24 max-w-4xl m-auto mb-6 ">
        <img
          src="/assets/images/logo/secondary.png"
          alt="Harmony Hub Logo and Brand"
        />
      </div>
      <div className="container mx-auto px-4 md:px-12 grid grid-cols-3 grid-rows-4 gap-4">
          {connectors?.map((connector) => (
            <div
              key={connector.connector_id}
              // className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3"
            >
              <IntegrationCard {...connector} />
            </div>
          ))}
          {(connectors?.length ?? 0) > 0 && (
            <div 
            // className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3"
            >
              <IntegrationCard display_name="More coming soon" />
            </div>
          )}
      </div>
      {/* <SignedIn>
      </SignedIn> */}
      {/* <SignedOut>
        
      </SignedOut> */}
      <Jumbo />
    </>
  );
}
