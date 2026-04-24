import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, {type Options as KyOptions} from "ky";

type HTTPRequestData={
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

    if(!data.endpoint){
        throw new NonRetriableError("HTTP Request Node:No endpoint is configured");
    }
    const result=await step.run("http-request",async()=>{
        const endpoint=data.endpoint!;
        const method=data.method || "GET";

        const options:KyOptions={ method }

        if(["POST","PUT","PATCH"].includes(method)){
            options.body=data.body;  
        }

        const response=await ky(endpoint,options);
        const contentType=response.headers.get("content-type");
        const responseData=contentType?.includes("application/json")?await response.json():await response.text();

        return {
            ...context,
            httpResponse:{
                status:response.status,
                statusText:response.statusText,
                data:responseData,
            }
        }
    });

    // TODO: publish "success" state for http-request

    return result;

};
