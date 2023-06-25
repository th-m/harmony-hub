import { useAuth } from "@clerk/remix";
import { useKollaEvents } from "@kolla/react-sdk";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import type {
  ConnectorMethodRequest,
  ConnectorMethodResponse,
  ConnectorMethods,
} from "~/models/integration.methods.server";
import type { ConnectorID } from "~/models/kolla.utils";

export const useConnectorFetcher = <
  cid extends ConnectorID,
  m extends ConnectorMethods<cid>
>(
  connector_id: cid,
  method: m,
  args: ConnectorMethodRequest<cid, m>
) => {
  const { userId } = useAuth();
  const { authenticated } = useKollaEvents();
  const fetcher = useFetcher<ConnectorMethodResponse<cid, m>>();

  useEffect(() => {
    if (authenticated && userId && connector_id && method) {
      if (fetcher.state === "idle") {
        fetcher.submit(args ?? {}, {
          method: "post",
          action: `/api/user/${userId}/connector/${connector_id}/method/${String(
            method
          )}`,
        });
      }
    }
  }, [fetcher, authenticated, args, userId, connector_id, method]);

  return fetcher;
};
