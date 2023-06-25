import { KollaClient } from "@kolla/node-sdk";
import invariant from "tiny-invariant";

invariant(
  process.env.KOLLA_KEY,
  "SESSION_SECRET must be set in your environment variables."
);

export const kClient = new KollaClient({apiKey:process.env.KOLLA_KEY})
