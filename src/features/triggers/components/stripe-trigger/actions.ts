"use server";

import { getSubscriptionToken } from "inngest/realtime";
import { inngest } from "@/inngest/client";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

export type StripeTriggerToken = Awaited<
  ReturnType<typeof fetchStripeTriggerRealtimeToken>
>;

export async function fetchStripeTriggerRealtimeToken() {
  return getSubscriptionToken(inngest, {
    channel: stripeTriggerChannel,
    topics: ["status"],
  });
}
