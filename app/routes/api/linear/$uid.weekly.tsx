
import { LinearClient} from "@linear/sdk";
import type { LoaderFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import { getCredentialsFetch } from "~/models/kolla.server";
import { linearConnectorID } from "~/models/kolla.utils";

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
  const myIssues = await me.assignedIssues();

  if (!(myIssues.nodes.length > 0)) {
    return json({});
  }
  const issues = myIssues.nodes.map((issue) => issue);

  return json(issues);
};
