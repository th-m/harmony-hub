import type { ActionFunction} from "@remix-run/node";
import { json } from "@remix-run/node";

import { kClient } from "~/models/kolla.server";

export const action: ActionFunction = async (args) => {
  const body = await args.request.json();
  if (!body.consumer_id) {
    return {};
  }
  const token = await kClient.consumerToken(body);
  return json(token);
};
