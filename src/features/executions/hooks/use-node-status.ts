import type { Realtime } from "inngest/realtime";
import { useRealtime } from "inngest/react";
import { useEffect, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

interface useNodeStatusOptions {
  nodeId: string;
  channel: Realtime.ChannelInput;
  topics: readonly string[];
  refreshToken: () => Promise<
    | string
    | Realtime.Subscribe.ClientToken
    | Realtime.Subscribe.Token
  >;
}

export function useNodeStatus({
  nodeId,
  channel,
  topics,
  refreshToken,
}: useNodeStatusOptions) {
  const [status, setStatus] = useState<NodeStatus>("initial");

  const { messages } = useRealtime({
    channel,
    topics,
    token: refreshToken,
    enabled: true,
  });

  useEffect(() => {
    if (!messages.all.length) {
      return;
    }

    const latestMessage = messages.all
      .filter(
        (msg) =>
          msg.kind === "data" &&
          (msg as { data?: { nodeId?: string } }).data?.nodeId === nodeId,
      )
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }
        return 0;
      })[0];
    if (latestMessage?.kind === "data") {
      setStatus(
        (latestMessage as { data: { status: string } }).data
          .status as NodeStatus,
      );
    }
  }, [messages.all, nodeId, channel, topics]);

  return status;
}
