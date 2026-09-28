"use client";

import { useState } from "react";
import {
  CheckIcon,
  CopyIcon,
  HardDriveIcon,
  CloudIcon,
  RefreshCwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  TriangleAlertIcon,
} from "lucide-react";

import { Markdown } from "@/components/chat/markdown";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

function IconAction({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={label}
          aria-pressed={active}
          onClick={onClick}
          className={cn(
            "text-muted-foreground hover:text-foreground transition-colors",
            active && "text-primary"
          )}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function CopyAction({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <IconAction
      label={copied ? "Copied" : "Copy"}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </IconAction>
  );
}

function Typing() {
  return (
    <span className="inline-flex gap-1 py-2" aria-label="Assistant is typing">
      {[0, 150, 300].map((d) => (
        <i
          key={d}
          className="size-1.5 rounded-full bg-primary"
          style={{ animation: `blink 1.2s ${d}ms infinite ease-in-out` }}
        />
      ))}
    </span>
  );
}

export function Message({
  message,
  isLast,
  onRegenerate,
  onFeedback,
}: {
  message: ChatMessage;
  isLast: boolean;
  onRegenerate: (id: string) => void;
  onFeedback: (id: string, value: "up" | "down") => void;
}) {
  if (message.role === "user") {
    return (
      <div className="group flex flex-col items-end gap-1 mb-4">
        <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-primary/10 border border-primary/20 px-4 py-2.5 text-[15px] leading-7 break-words whitespace-pre-wrap text-foreground">
          {message.content}
        </div>
        <div className="opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100 px-1">
          <CopyAction text={message.content} />
        </div>
      </div>
    );
  }

  const { meta } = message;
  return (
    <div className="group flex gap-4 mb-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl border border-primary/30 bg-background shadow-sm">
        <span className="size-3 rounded-sm bg-primary" />
      </div>
      <div className="min-w-0 flex-1">
        {meta?.fallback && meta.notice && (
          <p className="mb-2 flex items-start gap-1.5 rounded-md border border-dashed border-destructive/30 bg-destructive/5 px-2.5 py-1.5 text-xs text-destructive">
            <TriangleAlertIcon className="mt-px size-3.5 shrink-0" />
            <span>
              Switched to {meta.provider_label} because the selected model was unavailable (
              {meta.notice}).
            </span>
          </p>
        )}

        {message.content ? (
          <div className="rounded-2xl rounded-tl-none bg-background/40 backdrop-blur-sm border border-border/50 px-4 py-2.5 text-[15px] leading-7 break-words">
            <Markdown content={message.content} />
          </div>
        ) : message.pending ? (
          <div className="px-4 py-2.5 rounded-2xl rounded-tl-none bg-background/40 border border-border/50">
            <Typing />
          </div>
        ) : null}

        {message.error && (
          <div className="mt-2 flex flex-wrap items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            <span className="flex-1">{message.error}</span>
            <Button size="sm" variant="outline" onClick={() => onRegenerate(message.id)}>
              <RefreshCwIcon />
              Try again
            </Button>
          </div>
        )}

        {!message.pending && !message.error && (
          <div
            className={cn(
              "mt-2 flex items-center gap-0.5 transition-opacity [@media(hover:none)]:opacity-100 pl-1",
              isLast ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-within:opacity-100",
            )}
          >
            <CopyAction text={message.content} />
            <IconAction
              label="Good response"
              active={message.feedback === "up"}
              onClick={() => onFeedback(message.id, "up")}
            >
              <ThumbsUpIcon />
            </IconAction>
            <IconAction
              label="Bad response"
              active={message.feedback === "down"}
              onClick={() => onFeedback(message.id, "down")}
            >
              <ThumbsDownIcon />
            </IconAction>
            {isLast && (
              <IconAction label="Regenerate" onClick={() => onRegenerate(message.id)}>
                <RefreshCwIcon />
              </IconAction>
            )}
            {meta && (
              <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground/70">
                {meta.local ? (
                  <HardDriveIcon className="size-3" />
                ) : (
                  <CloudIcon className="size-3" />
                )}
                {meta.model}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
