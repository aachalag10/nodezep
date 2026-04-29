// src/inngest/functions.ts
import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { TopologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import type { WorkflowContext } from "@/features/executions/types";
export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0, // TODO:REMOVE IN PRODUCTION.
    triggers: [{ event: "workflows/execute.workflow" }],
  },
  async ({ event, step }) => {
    const workflowId = (event.data as { workflowId?: string }).workflowId;
    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is missing");
    }
    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });
      return TopologicalSort(workflow.nodes, workflow.connections);
    });

    const eventData = event.data as {
      initialData?: WorkflowContext;
    };
    let context: WorkflowContext = eventData.initialData ?? {};

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        context,
        nodeId: node.id,
        step,
        publish: inngest.realtime.publish.bind(inngest),
      });
    }
    return { sortedNodes };
  },
);
