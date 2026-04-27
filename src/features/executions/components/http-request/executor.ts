import Handlebars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import { httpRequestChannel } from "@/inngest/channels/http-request";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});
type HTTPRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HTTPRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  await publish(
    httpRequestChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.endpoint) {
    await publish(
        httpRequestChannel().status({
            nodeId,
            status:"error",
        }),
    ),
    throw new NonRetriableError("HTTP Request node:No endpoint configured")
}


  if (!data.variableName) {
    await publish(
        httpRequestChannel().status({
            nodeId,
            status:"error",
        }),
    );
    throw new NonRetriableError("HTTP Request node:Variable name not configured")
  }

  if(!data.method){
    await publish(
      httpRequestChannel().status({
        nodeId,
        status:"error",
      }),
    );
    throw new NonRetriableError("HTTP Request Node:Method not configured")
  }

  try{
  const result = await step.run("http-request", async () => {
    const endpoint = Handlebars.compile(data.endpoint)(context);
    console.log("ENDPOINT", { endpoint });
    const method = data.method;

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = Handlebars.compile(data.body)(context);
      console.log("BODY:", resolved);
      JSON.parse(resolved);
      options.body = resolved;
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const compiledVariableName = Handlebars.compile(data.variableName)(context);
    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });

  await publish(
    httpRequestChannel().status({
        nodeId,
        status:"success",
    })
  )

  return result;
}
catch(error){
  await publish(
    httpRequestChannel().status({
      nodeId,
      status:"error"
    }),
  );
  throw error;
}
};
