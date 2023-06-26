import type { ActionFunction, LoaderFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
// import { getAuth } from "@clerk/remix/ssr.server";
// import type { ConsumerTokenRequest} from "~/models/kolla.server";
// import { getConsumerToken } from "~/models/kolla.server";
// import { KollaClient } from "@kolla/node-sdk";
import { kClient } from "~/models/kolla.server";
// export const loader: LoaderFunction = async (args) => {
//   const { userId, user } = await getAuth(args);
//   if (!userId) {
//     return {};
//   }
//   const token = await kClient.consumerToken({
//     consumer_id: userId,
//     metadata: {
//       username: `${user?.firstName} ${user?.lastName}`,
//       email: user?.emailAddresses?.[0]?.emailAddress ?? "",
//     },
//   });
//   return json(token);
// };
export const action: ActionFunction = async (args) => {
  const body = await args.request.json();
  if (!body.consumer_id) {
    return {};
  }
  const token = await kClient.consumerToken(body);
  return json(token);
};
