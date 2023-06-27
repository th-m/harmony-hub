import { useAuth } from "@clerk/remix";
import { useKollaEvents } from "@kolla/react-sdk";
import { useFetcher } from "@remix-run/react";
import { useCallback, useEffect } from "react";
import type {
  ConnectorMethodRequest,
  ConnectorMethodResponse,
  ConnectorMethods,
} from "~/models/integration.methods.server";
import type { ConnectorID } from "~/models/kolla.utils";

export const useConnectorAutoFetcher = <
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
      if (fetcher.state === "idle" && !fetcher.data) {
        try {
          fetcher.submit(args ?? {}, {
            method: "post",
            action: `/api/user/${userId}/connector/${connector_id}/method/${String(
              method
            )}`,
          });
        } catch (error) {
          console.log(error)
        }
      }
    }
  }, [fetcher, authenticated, args, userId, connector_id, method]);

  return fetcher;
};

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

  const fetch = useCallback(() => {
    console.log({args})
    if (authenticated && userId && connector_id && method) {
      if (fetcher.state === "idle") {
        try {
          fetcher.submit(args ?? {}, {
            method: "post",
            action: `/api/user/${userId}/connector/${connector_id}/method/${String(
              method
            )}`,
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  }, [fetcher, authenticated, args, userId, connector_id, method]);

  return [ fetcher, fetch ] as const;
};
