import { channel } from "inngest/realtime";
import { z } from "zod";

export const MANUAL_TRIGGER_CHANNEL_NAME = "manual-trigger-execution" as const;

const statusDataSchema = z.object({
  nodeId: z.string(),
  status: z.enum(["loading", "success", "error"]),
});

export const manualTriggerChannel = channel({
  name: MANUAL_TRIGGER_CHANNEL_NAME,
  topics: {
    status: { schema: statusDataSchema },
  },
});
