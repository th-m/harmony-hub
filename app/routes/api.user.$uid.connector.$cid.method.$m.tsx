import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { kClient } from "~/models/kolla.server";
import type { ConnectorID } from "~/models/kolla.utils";

import { integrationMethods } from "~/models/integration.methods.server";

export const action: ActionFunction = async (args) => {
  const consumer_id = args.params["uid"];
  const connector_id = args.params["cid"] as ConnectorID;
  const methods = integrationMethods?.[connector_id];
  const method = args.params["m"] as keyof typeof methods;
  const _func = methods?.[method];
  const requestBody = await args.request.json();
  
  if (!consumer_id || !connector_id || !method || !methods || !_func) {
    return json({ message: "something isn't lining up right" }, 400);
  }

  try {
    const credentials = await kClient.connectorCredentials({
      consumer_id,
      connector_id,
    });

    const data = await _func(credentials.credentials.token)(requestBody);
    return json(data);
  } catch (error) {
    return json({ message: String(error) }, 500);
  }
};
