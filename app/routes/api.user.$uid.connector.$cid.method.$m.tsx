import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { kClient } from "~/models/kolla.server";
import type { ConnectorID } from "~/models/kolla.utils";

import { integrationMethods } from "~/models/integration.methods.server";
function formDataToObject(formData: FormData) {
  const normalizeValues = (values: any) =>
    values.length > 1 ? values : values[0];
  const formElemKeys = Array.from(formData.keys());

  return Object.fromEntries(
    // store array of values or single value for element key
    formElemKeys.map((key) => [key, normalizeValues(formData.getAll(key))])
  );
}
export const action: ActionFunction = async (args) => {
  const consumer_id = args.params["uid"];
  const connector_id = args.params["cid"] as ConnectorID;
  if (!(connector_id in integrationMethods)) {
    return json({ message: "you need a proper connector id" }, 400);
  }
  const methods = integrationMethods?.[connector_id];
  const method = args.params["m"];
  if (!method || !(method in methods)) {
    return json({ message: "you need a method name in the params" }, 400);
  }

  // @ts-ignore
  const _func = methods?.[method];

  const requestData = await args.request.formData();
  const requestBody = formDataToObject(requestData);

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
