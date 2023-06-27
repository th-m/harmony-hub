export const wakatimeConnectorId = "wakatime-2478";
export const fitbitConnectorId = "fitbit-99562";
export const githubConnectorID = "github-88436";
export const linearConnectorID = "linear-783";
export const openaiConnectorID = "openai-apikey-27922";
export const rescueTimeID = "rescuetime-55002";
export const connectorIDs = [
  wakatimeConnectorId,
  fitbitConnectorId,
  githubConnectorID,
  linearConnectorID,
  openaiConnectorID,
  rescueTimeID,
] as const;

export type ConnectorID = typeof connectorIDs[number]