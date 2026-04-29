"use server";

import { getSubscriptionToken } from "inngest/realtime";
import { inngest } from "@/inngest/client";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

export type GoogleFormTriggerToken = Awaited<
  ReturnType<typeof fetchGoogleFormTriggerRealtimeToken>
>;

export async function fetchGoogleFormTriggerRealtimeToken() {
  return getSubscriptionToken(inngest, {
    channel: googleFormTriggerChannel,
    topics: ["status"],
  });
}
