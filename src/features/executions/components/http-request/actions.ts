"use server";

import { getSubscriptionToken } from "inngest/realtime";
import { inngest } from "@/inngest/client";
import { httpRequestChannel } from "@/inngest/channels/http-request";

export type HttpRequestToken = Awaited<
  ReturnType<typeof fetchHttpRequestRealtimeToken>
>;

export async function fetchHttpRequestRealtimeToken(): Promise<HttpRequestToken> {
  return getSubscriptionToken(inngest, {
    channel: httpRequestChannel,
    topics: ["status"],
  });
}
