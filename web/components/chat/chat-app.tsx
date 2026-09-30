"use client";

import { useCallback, useEffect, useState } from "react";

import { PanelLeftIcon, SquarePenIcon } from "lucide-react";
import { toast } from "sonner";

import { AppSidebar } from "@/components/chat/app-sidebar";
import { Composer } from "@/components/chat/composer";
import {
  EmptyState,
  SuggestionGrid,
} from "@/components/chat/empty-state";
import { MessageList } from "@/components/chat/message-list";
import { ModelPicker } from "@/components/chat/model-picker";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChat } from "@/hooks/use-chat";
import { useModels } from "@/hooks/use-models";
import { cn } from "@/lib/utils";

export function ChatApp() {
  const models = useModels();
  const chat = useChat(models.selection);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const empty = !chat.active || chat.active.messages.length === 0;
  const noModels = !models.loading && !models.effective;

  const newChat = useCallback(() => {
    chat.newChat();
    setMobileOpen(false);
  }, [chat]);

  const openChat = (id: string) => {
    chat.openChat(id);
    setMobileOpen(false);
  };

  const deleteChat = (id: string) => {
    const undo = chat.deleteChat(id);

    toast("Chat deleted", {
      action: {
        label: "Undo",
        onClick: undo,
      },
    });
  };

  const clearAll = () => {
    const undo = chat.clearAll();

    toast("All chats deleted", {
      action: {
        label: "Undo",
        onClick: undo,
      },
    });
  };

  // Global shortcuts: new chat, search, stop.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      if (
        mod &&
        e.shiftKey &&
        e.key.toLowerCase() === "o"
      ) {
        e.preventDefault();
        newChat();
      } else if (
        mod &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();

        setSidebarOpen(true);
        setMobileOpen(true);

        requestAnimationFrame(() =>
          document.getElementById("chat-search")?.focus(),
        );
      } else if (
        e.key === "Escape" &&
        chat.streaming
      ) {
        chat.stop();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [chat, newChat]);

  const sidebarProps = {
    conversations: chat.conversations,
    activeId: chat.activeId,
    onNewChat: newChat,
    onOpen: openChat,
    onDelete: deleteChat,
    onClearAll: clearAll,
    apiOnline: !models.error,
  };

  const composer = (
    <Composer
      onSend={chat.send}
      onStop={chat.stop}
      streaming={chat.streaming}
      disabled={noModels}
      autoFocus
      placeholder={
        noModels
          ? "No AI model available — see the model menu"
          : undefined
      }
    />
  );

  return (
    <div className="relative flex h-dvh overflow-hidden bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "z-10 hidden shrink-0 border-r border-border/50 transition-[margin] duration-200 md:block md:w-72",
          !sidebarOpen && "md:-ml-72",
        )}
        aria-hidden={!sidebarOpen}
        inert={!sidebarOpen}
      >
        <AppSidebar
          {...sidebarProps}
          onCollapse={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Mobile sidebar */}
      <Sheet
        open={mobileOpen}
        onOpenChange={setMobileOpen}
      >
        <SheetContent
          side="left"
          showClose={false}
          className="w-72 bg-sidebar p-0 md:hidden"
        >
          <SheetTitle className="sr-only">
            Conversations
          </SheetTitle>

          <SheetDescription className="sr-only">
            Your chat history
          </SheetDescription>

          <AppSidebar
            {...sidebarProps}
            onCollapse={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main chat area */}
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="relative z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/50 bg-background/80 px-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open sidebar"
                  className={cn(
                    "hover:bg-accent/50",
                    sidebarOpen && "md:hidden",
                  )}
                  onClick={() => {
                    setSidebarOpen(true);
                    setMobileOpen(true);
                  }}
                >
                  <PanelLeftIcon className="size-5" />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                Open sidebar
              </TooltipContent>
            </Tooltip>

            <ModelPicker models={models} />
          </div>

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="New chat"
                  className={cn(
                    "hover:bg-accent/50",
                    sidebarOpen && "md:hidden",
                  )}
                  onClick={newChat}
                >
                  <SquarePenIcon className="size-5" />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                New chat
              </TooltipContent>
            </Tooltip>

            <div className="mx-1 h-6 w-px bg-border" />

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent/50"
              title="Settings"
            >
              <div className="size-4 rounded-full border-2 border-muted-foreground" />
            </Button>
          </div>
        </header>

        {/* =========================================================
            CHAT WATERMARK
            Exact logo from public/logo.png
            ========================================================= */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
        >
          <img
            src="/logo.png"
            alt=""
            className="w-[min(55vw,600px)] max-w-[600px] select-none opacity-[0.3]"
          />
        </div>

        {/* =========================================================
            CHAT CONTENT
            ========================================================= */}
        {empty ? (
          <div className="relative z-10 flex flex-1 flex-col justify-center overflow-y-auto px-4 pb-[8vh] sm:px-6">
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-20">
              <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
            </div>

            <EmptyState />

            <div className="relative z-10 mx-auto w-full max-w-4xl">
              {composer}
            </div>

            <SuggestionGrid onPick={chat.send} />
          </div>
        ) : (
          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            <MessageList
              conversation={chat.active!}
              streaming={chat.streaming}
              onRegenerate={chat.regenerate}
              onFeedback={chat.setFeedback}
            />

            <div className="relative z-10 shrink-0 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6">
              <div className="mx-auto w-full max-w-4xl">
                {composer}
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p className="relative z-20 shrink-0 pb-4 text-center text-[11px] text-muted-foreground/60">
          AI can make mistakes. Check important information.
        </p>
      </main>
    </div>
  );
}