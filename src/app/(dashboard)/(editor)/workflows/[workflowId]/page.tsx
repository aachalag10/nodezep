import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";

interface pageProps{
    params:Promise<{
        workflowId:string
    }>
}

const Page=async ({params}:pageProps)=>{
        await requireAuth();
    const {workflowId}=await params;
    prefetchWorkflow(workflowId);
    return(
        <p>workflowId:{workflowId}</p>
    )
}

export default Page;