import { KollaClient } from "@kolla/node-sdk";
import invariant from "tiny-invariant";

invariant(
  process.env.KOLLA_KEY,
  "SESSION_SECRET must be set in your environment variables."
);

export const kClient = new KollaClient({apiKey:process.env.KOLLA_KEY})
// kClient.connectorCredentials
// export interface ConsumerTokenRequest {
//   consumer_id: string;
//   metadata: {
//     username?: string;
//     email?: string;
//     tenant_id?: string;
//     tenant_display_name?: string;
//   };
// }

// export interface ConsumerTokenResponse {
//   expiry_time: string;
//   name: string;
//   token: string;
// }
// export const getConsumerToken = async (data: ConsumerTokenRequest) => {
//   const resp = await fetch(
//     "https://api.getkolla.com/connect/v1/consumers:consumerToken",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: `Bearer ${process.env.KOLLA_KEY}`,
//       },
//       body: JSON.stringify(data),
//     }
//   );
//   const respData = await resp.json() as ConsumerTokenResponse;
//   return respData;
// };


// export interface ConnectorInfo {
//   credentials: Credentials;
//   linked_account: LinkedAccount;
// }

// interface Credentials {
//   token: string;
//   expiry_time: string;
//   secrets: Secrets;
// }

// interface Secrets {}

// interface LinkedAccount {
//   name: string;
//   uid: string;
//   consumer_id: string;
//   consumer_metadata: ConsumerMetadata;
//   install_uri: string;
//   state: string;
//   state_message: string;
//   credentials: Credentials2;
//   auth_data: AuthData;
//   auth_state: string;
//   auth_state_description: string;
//   linked_account_scopes: string[];
//   labels: Labels;
//   consumer_config_values: ConsumerConfigValues;
//   create_time: string;
//   update_time: string;
//   expire_time: any;
// }

// interface ConsumerMetadata {
//   title: string;
//   email: string;
// }

// interface Credentials2 {}

// interface AuthData {
//   token_type: string;
//   uid: string;
// }

// interface Labels {}

// interface ConsumerConfigValues {}
// export const getCredentialsFetch = async(
//   consumer_id: string,
//   connector_id: string
// ) => {

//   const requestOptions: RequestInit = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       Authorization: `Bearer ${process.env.KOLLA_KEY}`,
//     },
//     redirect: "follow",
//     body: JSON.stringify({ consumer_id }),
//   };

//   const resp = await fetch(
//     `https://api.getkolla.com/connect/v1/connectors/${connector_id}/linkedaccounts/-:credentials`,
//     requestOptions
//   );
//   const respData:ConnectorInfo = await resp.json()
//   return respData
// };
