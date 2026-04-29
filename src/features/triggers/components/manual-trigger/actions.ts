"use server";

import { getSubscriptionToken } from "inngest/realtime";
import { inngest } from "@/inngest/client";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

export type ManualTriggerToken = Awaited<
  ReturnType<typeof fetchManualTriggerRealtimeToken>
>;

export async function fetchManualTriggerRealtimeToken() {
  return getSubscriptionToken(inngest, {
    channel: manualTriggerChannel,
    topics: ["status"],
  });
}
