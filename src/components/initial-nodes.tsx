"use client";

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { WorkflowNode } from "./workflow-node";
import { PlaceholderNode } from "./react-flow/placeholder-node";

export const InitialNode = memo((props: NodeProps) => {
  return (
    <WorkflowNode showToolbar={false}>
    <PlaceholderNode {...props} onClick={() => {}}>
      <div className="cursor-pointer items-center justify-center">
        <PlusIcon className="size-4" />
      </div>
    </PlaceholderNode>
    </WorkflowNode>
  );
});
