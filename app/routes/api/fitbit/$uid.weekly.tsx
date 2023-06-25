import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { azmSummary, sleepSummary } from "~/models/fitbit.server";
import { kClient } from "~/models/kolla.server";
// import { getCredentialsFetch } from "~/models/kolla.server";
import { fitbitConnectorId } from "~/models/kolla.utils";
import { weekStartEnd } from "~/utils/date";

export const loader: LoaderFunction = async (args) => {
  const userId = args.params["uid"];
  if (!userId) {
    return json({});
  }

  const credentials = await kClient.connectorCredentials({
    consumer_id: userId ?? "",
    connector_id: fitbitConnectorId,
  });

  if (!credentials?.credentials?.token) {
    return json({});
  }
  const { start, end } = weekStartEnd();
  const sleep = await sleepSummary({
    start,
    end,
    token: credentials?.credentials?.token,
  });
  const azm = await azmSummary({
    end,
    period: "7d",
    token: credentials?.credentials?.token,
  });

  return json({ sleep, azm });
};
