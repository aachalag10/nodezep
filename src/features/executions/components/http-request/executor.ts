import Handlebars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import { httpRequestChannel } from "@/inngest/channels/http-request";

type HTTPRequestData={
    variableName?:string;
    endpoint?:string;
    method?:"GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?:string;
}

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

    if(!data.endpoint){
        throw new NonRetriableError("HTTP Request Node:No endpoint is configured");
    }
    if(!data.variableName){
        throw new NonRetriableError("Variable name not configured");
    }
    const result=await step.run("http-request",async()=>{
        const endpoint=data.endpoint!;
        const method=data.method || "GET";


        if(["POST","PUT","PATCH"].includes(method)){
            options.body=data.body;  
            options.headers={
                "Content-Type":"application/json",
            }
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


        const responsePayload={
            httpResponse:{
                status:response.status,
                statusText:response.statusText,
                data:responseData,
            },
        };

        if(data.variableName){

     
        return {
            ...context,
            [data.variableName]:responsePayload,
        };
    }
    //fallback to direct httpResponse for backward compatibility
    return{
        ...context,
        ...responsePayload,
    }
    });

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
