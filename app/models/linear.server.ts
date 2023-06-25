import { LinearClient } from "@linear/sdk";
import type { WorkflowStateFilter } from "@linear/sdk/dist/_generated_documents";
import type { StartEndToDates } from "~/utils/date";
import { startEndToDate } from "~/utils/date";

export const linearIssues =
  (token: string) => async (args: StartEndToDates) => {
    const { start, end } = startEndToDate(args);
    const linearClient = new LinearClient({
      accessToken: token,
    });

    const me = await linearClient.viewer;

    const filter: WorkflowStateFilter = {
      updatedAt: { gt: start, lt: end },
    };

    const myIssues = await me.assignedIssues({ filter });

    if (!(myIssues.nodes.length > 0)) {
      return [];
    }
    const issues = myIssues.nodes.map((issue) => issue);
    return issues;
  };
