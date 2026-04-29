"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";

const COPIED_RESET_MS = 2500;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({ open, onOpenChange }: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;
  const [webhookCopied, setWebhookCopied] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);
  const webhookCopiedTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const scriptCopiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

  useEffect(() => {
    return () => {
      if (webhookCopiedTimer.current) clearTimeout(webhookCopiedTimer.current);
      if (scriptCopiedTimer.current) clearTimeout(scriptCopiedTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setWebhookCopied(false);
      setScriptCopied(false);
    }
  }, [open]);

  const flashCopied = useCallback(
    (which: "webhook" | "script") => {
      if (which === "webhook") {
        setWebhookCopied(true);
        if (webhookCopiedTimer.current) clearTimeout(webhookCopiedTimer.current);
        webhookCopiedTimer.current = setTimeout(() => {
          setWebhookCopied(false);
          webhookCopiedTimer.current = null;
        }, COPIED_RESET_MS);
      } else {
        setScriptCopied(true);
        if (scriptCopiedTimer.current) clearTimeout(scriptCopiedTimer.current);
        scriptCopiedTimer.current = setTimeout(() => {
          setScriptCopied(false);
          scriptCopiedTimer.current = null;
        }, COPIED_RESET_MS);
      }
    },
    [],
  );

  const copyWebhookUrl = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
      flashCopied("webhook");
    } catch {
      toast.error("Failed to copy webhook URL");
    }
  };

  const copyAppsScript = async () => {
    const script = generateGoogleFormScript(webhookUrl);
    try {
      await navigator.clipboard.writeText(script);
      toast.success("Google Apps Script copied to clipboard");
      flashCopied("script");
    } catch {
      toast.error("Failed to copy script");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Google Form Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use this webhook URL in the google form to trigger the workflow
            when a form is submitted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Webhook URL */}
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={copyWebhookUrl}
                aria-label={
                  webhookCopied ? "Webhook URL copied" : "Copy webhook URL"
                }
              >
                {webhookCopied ? (
                  <CheckIcon className="size-4 text-green-600" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Setup instructions</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Google Form</li>
              <li>Click the three dots menu - Script editor</li>
              <li>Copy and paste the script below</li>
              <li>Replace WEBHOOK_URL with the webhook URL above</li>
              <li>Save and click Triggers - Add Trigger</li>
              <li>Choose: From form - on form submit - Save</li>
            </ol>
          </div>

          {/* Script Section */}
          <div className="rounded-lg bg-muted p-4 space-y-3">
            <h4 className="font-medium">Google Apps Scripts:</h4>
            <Button
              type="button"
              variant="outline"
              onClick={copyAppsScript}
              aria-label={
                scriptCopied
                  ? "Google Apps Script copied"
                  : "Copy Google Apps Script"
              }
            >
              {scriptCopied ? (
                <CheckIcon className="size-4 mr-2 text-green-600" />
              ) : (
                <CopyIcon className="size-4 mr-2" />
              )}
              {scriptCopied ? "Copied!" : "Copy Google Apps Script"}
            </Button>
            <p className="text-sm text-muted-foreground">
              This script includes your webhook URL and handles form submissions.
            </p>
          </div>

          {/* Available Variables 1 */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Available Variables:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">{"{{googleForm.respondentEmail}}"}</code>
             -Respondent's email 
             </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">{"{{googleForm.responses['Question Name']}}"}</code>
             -Specific answer 
             </li>
             <li>
                <code className="bg-background px-1 py-0.5 rounded">{"{{json googleForm.responses}}"}</code>
             -All responses as JSON
             </li>
            </ul>
          </div>

          {/* Available Variables 2 */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium">Available variables</h4>
            <p className="text-sm text-muted-foreground">
              You can use the following variables in your Google Apps Script:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>formId</li>
              <li>formTitle</li>
              <li>responseId</li>
            </ul>
          </div>
        </div>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Used to manually trigger a workflow, no configurations available.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};