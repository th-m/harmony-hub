import type { ConnectorID } from "./kolla.utils";
import {
  fitbitConnectorId,
  githubConnectorID,
  linearConnectorID,
  openaiConnectorID,
  wakatimeConnectorId,
} from "./kolla.utils";
import { wakaWeekly } from "./wakatime.server";
import { fitbitWeekly } from "./fitbit.server";

import { linearIssues } from "./linear.server";
import { openaiSummary } from "./openai.server";

type IntegrationMethodInterface = {
  [c in ConnectorID]: {
    [k: string]: (token: string) => (...args: any) => Promise<any>;
  };
};

export const integrationMethods = {
  [wakatimeConnectorId]: {
    summary: wakaWeekly,
  },
  [fitbitConnectorId]: {
    summary: fitbitWeekly,
  },
  [linearConnectorID]: {
    summary: linearIssues,
  },
  [openaiConnectorID]: {
    report: openaiSummary,
  },
  [githubConnectorID]: {
    summary: (token: string) => async (args: any) => {
      return { message: "implement me" };
    },
  },
} satisfies IntegrationMethodInterface;

type IntegrationMethods = typeof integrationMethods;

export type ConnectorMethods<c extends ConnectorID> =
  keyof IntegrationMethods[c];
export type ConnectorMethod<
  c extends ConnectorID,
  m extends ConnectorMethods<c>
> = ReturnType<IntegrationMethods[c][m]>;
export type ConnectorMethodRequest<
  c extends ConnectorID,
  m extends ConnectorMethods<c>
> = ConnectorMethod<c, m> extends (...args: any) => any
  ? Parameters<ConnectorMethod<c, m>>[0]
  : undefined;
export type ConnectorMethodResponse<
  c extends ConnectorID,
  m extends ConnectorMethods<c>
> = ConnectorMethod<c, m> extends (...args: any) => any
  ? Awaited<ReturnType<ConnectorMethod<c, m>>>
  : undefined;
