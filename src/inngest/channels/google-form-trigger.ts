import { channel } from "inngest/realtime";
import { z } from "zod";

export const GOOGLE_FORM_TRIGGER_CHANNEL_NAME = "google-form-trigger-execution" as const;

const statusDataSchema = z.object({
  nodeId: z.string(),
  status: z.enum(["loading", "success", "error"]),
});

export const googleFormTriggerChannel = channel({
  name: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
  topics: {
    status: { schema: statusDataSchema },
  },
});
