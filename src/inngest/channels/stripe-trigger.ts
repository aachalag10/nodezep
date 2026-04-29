import { channel } from "inngest/realtime";
import { z } from "zod";

export const STRIPE_TRIGGER_CHANNEL_NAME = "stripe-trigger-execution" as const;

const statusDataSchema = z.object({
  nodeId: z.string(),
  status: z.enum(["loading", "success", "error"]),
});

export const stripeTriggerChannel = channel({
  name: STRIPE_TRIGGER_CHANNEL_NAME,
  topics: {
    status: { schema: statusDataSchema },
  },
});
