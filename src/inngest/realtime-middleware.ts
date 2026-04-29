import { Middleware, type Inngest } from "inngest";

/**
 * Compatibility shim for the deprecated `@inngest/realtime` middleware.
 *
 * In Inngest JS v4, Realtime is part of the main `inngest` package, so the old
 * `realtimeMiddleware` hook is not required. This class is a no-op middleware
 * that preserves the same client options shape.
 */
export function realtimeMiddleware(): Middleware.Class {
  return class InngestRealtimeCompatMiddleware extends Middleware.BaseMiddleware {
    readonly id = "inngest-realtime-compat" as const;

    constructor(args: { client: Inngest.Any }) {
      super(args);
    }
  };
}
