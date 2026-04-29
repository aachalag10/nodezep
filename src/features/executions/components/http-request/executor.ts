import Handlebars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import { httpRequestChannel } from "@/inngest/channels/http-request";

type HTTPRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HTTPRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const status = (s: "loading" | "success" | "error") =>
    publish(httpRequestChannel.status, { nodeId, status: s });

  if (!data.endpoint) {
    await status("error");
    throw new NonRetriableError("HTTP Request Node: No endpoint is configured");
  }
  if (!data.variableName) {
    await status("error");
    throw new NonRetriableError("Variable name not configured");
  }
  if (!data.method) {
    await status("error");
    throw new NonRetriableError("HTTP Request Node: Method not configured");
  }

  const endpoint = data.endpoint;
  const method = data.method;
  const variableName = data.variableName;

  try {
    await status("loading");

    const result = await step.run("http-request", async () => {
      const options: KyOptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method) && data.body) {
        const resolved = Handlebars.compile(data.body)(context);
        JSON.parse(resolved);
        options.body = resolved;
        options.headers = { "Content-Type": "application/json" };
      }

      const response = await ky(endpoint, options);
      const contentType = response.headers.get("content-type");
      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      const responsePayload = {
        httpResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      };

      return {
        ...context,
        [variableName]: responsePayload,
      };
    });

    await status("success");
    return result;
  } catch (error) {
    await status("error");
    throw error;
  }
};
