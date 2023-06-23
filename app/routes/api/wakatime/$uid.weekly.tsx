import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getCredentialsFetch } from "~/models/kolla.server";
import { wakatimeConnectorId } from "~/models/kolla.utils";
import { weekStartEnd } from "~/utils/date";
import { wakatimeSummary } from "~/models/wakatime.server";
export const loader: LoaderFunction = async (args) => {
  const userId = args.params["uid"];
  if (!userId) {
    return json({});
  }
  const credentials = await getCredentialsFetch(
    userId ?? "",
    wakatimeConnectorId
  );
  const { start, end } = weekStartEnd();
  const data = await wakatimeSummary({
    start,
    end,
    token: credentials?.credentials?.token,
  });

  return json(data);
};
