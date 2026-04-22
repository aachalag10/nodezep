import { NodeType } from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";
import { InitialNode } from "@/components/initial-nodes";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
