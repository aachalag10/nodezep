"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { ManualTriggerDialog } from "@/features/triggers/components/manual-trigger/dialog";
import {  HttpRequestDialog, HTTPRequestFormValues } from "./dialog";
import { methods } from "better-auth/client";

type HTTPRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

type HTTPRequestNodeType = Node<HTTPRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HTTPRequestNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeStatus = "initial";

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: HTTPRequestFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };
  const nodeData = props.data;
  const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"} ${nodeData.endpoint}`
    : "not configured yet";

  return (
    <>
      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
