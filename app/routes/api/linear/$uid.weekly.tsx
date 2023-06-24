import { LinearClient } from "@linear/sdk";
import { WorkflowStateFilter } from "@linear/sdk/dist/_generated_documents";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getCredentialsFetch } from "~/models/kolla.server";
import { linearConnectorID } from "~/models/kolla.utils";
import { weekStartEnd } from "~/utils/date";
// # Get date for 7 days ago
// seven_days_ago = datetime.datetime.now() - datetime.timedelta(days=7)
// seven_days_ago_iso = seven_days_ago.isoformat()
const { start, end } = weekStartEnd();
export const loader: LoaderFunction = async (args) => {
  const userId = args.params["uid"];
  if (!userId) {
    return json({});
  }

  const credentials = await getCredentialsFetch(
    userId ?? "",
    linearConnectorID
  );
  if (!credentials?.credentials?.token) {
    return json({});
  }
  const linearClient = new LinearClient({
    accessToken: credentials.credentials.token,
  });

  const me = await linearClient.viewer;

  const filter: WorkflowStateFilter = {
    updatedAt: { gt: start, lt:end },
  };

  const myIssues = await me.assignedIssues({ filter });

  if (!(myIssues.nodes.length > 0)) {
    return json({});
  }
  const issues = myIssues.nodes.map((issue) => issue);

  return json(issues);
};
