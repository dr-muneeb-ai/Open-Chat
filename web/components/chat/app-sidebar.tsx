"use client";

import { useMemo, useState } from "react";
import {
  CheckIcon,
  EllipsisIcon,
  MonitorIcon,
  MoonIcon,
  PanelLeftIcon,
  SearchIcon,
  SquarePenIcon,
  SunIcon,
  Trash2Icon,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { APP_CONFIG, initialsOf } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/types";

const DAY = 86_400_000;

function groupByDate(list: Conversation[]) {
  const today = new Date().setHours(0, 0, 0, 0);
  const groups: [string, Conversation[]][] = [
    ["Today", []],
    ["Yesterday", []],
    ["Previous 7 days", []],
    ["Previous 30 days", []],
    ["Older", []],
  ];
  for (const c of list) {
    const t = c.updatedAt;
    const i = t >= today ? 0 : t >= today - DAY ? 1 : t >= today - 7 * DAY ? 2 : t >= today - 30 * DAY ? 3 : 4;
    groups[i][1].push(c);
  }
  return groups.filter(([, items]) => items.length);
}

/**
 * Blood drip overlay — sits on top of the logo, background box color untouched.
 * viewBox is 0 0 32 32 to match the size-8 (32px) logo box.
 */
function BloodDripOverlay() {
  return (
    <svg
      className="absolute inset-0 z-20 size-full pointer-events-none mix-blend-multiply opacity-80"
      viewBox="0 0 32 32"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dripGradSm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a1c26" />
          <stop offset="60%" stopColor="#5c1017" />
          <stop offset="100%" stopColor="#3a0a0f" />
        </linearGradient>
      </defs>
      <path d="M6,0 Q7,7 5,10 Q4,11 5,13 Q4,15 6,15.5 Q8,15 7,13 Q8,11 7,10 Q9,7 8,0 Z" fill="url(#dripGradSm)" />
      <path d="M23,0 Q24,5 22,7 Q21,8 22,9.5 L24,9.5 Q25,8 24,7 Q26,5 25,0 Z" fill="url(#dripGradSm)" />
    </svg>
  );
}

export function AppSidebar({
  conversations,
  activeId,
  onNewChat,
  onOpen,
  onDelete,
  onClearAll,
  onCollapse,
  apiOnline,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onNewChat: () => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onCollapse?: () => void;
  apiOnline: boolean;
}) {
  const [query, setQuery] = useState("");
  const { theme, setTheme } = useTheme();

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...conversations]
      .filter(
        (c) =>
          !q ||
          c.title.toLowerCase().includes(q) ||
          c.messages.some((m) => m.content.toLowerCase().includes(q)),
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
    return groupByDate(list);
  }, [conversations, query]);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground transition-colors duration-300">
      <div className="flex items-center justify-between px-3 pt-6 pb-4">
        <div className="flex items-center gap-3 pl-1 font-semibold tracking-tight group cursor-default">
          <div className="relative grid size-8 place-items-center rounded-xl text-primary-foreground shadow-[0_0_15px_rgba(var(--gold-primary),0.3)] group-hover:shadow-[0_0_20px_rgba(var(--gold-primary),0.5)] transition-all duration-300 overflow-hidden">
            <img
              src="/logo.png"
              alt="Logo"
              className="relative z-10 size-full object-contain"
            />
            <BloodDripOverlay />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg">{APP_CONFIG.appName}</span>
            <span className="text-[10px] text-muted-foreground font-normal uppercase tracking-widest">AI Assistant</span>
          </div>
        </div>
        {onCollapse && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Close sidebar" onClick={onCollapse} className="hover:bg-accent/50 text-muted-foreground">
                <PanelLeftIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Close sidebar</TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="flex flex-col gap-3 px-3 pb-4">
        <Button
          variant="outline"
          className="relative overflow-hidden justify-start bg-background border-primary/30 hover:border-primary/60 text-foreground group transition-all duration-300"
          onClick={onNewChat}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <SquarePenIcon className="size-4 mr-2 text-primary" />
          New chat
          <kbd className="ml-auto hidden text-[10px] font-normal text-muted-foreground md:inline">
            Ctrl ⇧ O
          </kbd>
        </Button>
        <div className="relative group">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="chat-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats..."
            aria-label="Search chats"
            className="border-border/50 bg-background/50 pl-9 shadow-none hover:bg-accent/50 focus-visible:bg-background focus-visible:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <nav aria-label="Conversations" className="min-h-0 flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-border">
        {groups.length === 0 && (
          <p className="px-3 py-6 text-sm text-center text-muted-foreground/60 italic">
            {query ? "No chats match your search." : "Your conversations will appear here."}
          </p>
        )}
        {groups.map(([label, items]) => (
          <section key={label} className="mt-6">
            <h3 className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">{label}</h3>
            <ul className="space-y-1">
              {items.map((c) => {
                const active = c.id === activeId;
                return (
                  <li key={c.id} className="group/item relative">
                    <button
                      type="button"
                      onClick={() => onOpen(c.id)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "w-full truncate rounded-lg py-2 pr-9 pl-3 text-left text-sm transition-all duration-200",
                        active
                          ? "bg-primary/10 text-primary font-medium ring-1 ring-primary/20"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                      )}
                    >
                      {c.title}
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`Options for ${c.title}`}
                          className={cn(
                            "absolute top-1/2 right-1 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 transition-opacity",
                            active && "[@media(hover:none)]:opacity-100",
                          )}
                        >
                          <EllipsisIcon className="size-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="bg-popover border-border/50">
                        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(c.id)}>
                          <Trash2Icon className="size-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>

      <div className="border-t border-border/50 p-3 bg-sidebar/50 backdrop-blur-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left text-sm transition-all duration-200 hover:bg-accent/50 group"
            >
              <div className="relative">
                <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm group-hover:ring-2 ring-primary/20 transition-all">
                  {initialsOf(APP_CONFIG.user.name)}
                </span>
                <span
                  className={cn(
                    "absolute bottom-0 right-0 size-2 rounded-full border-2 border-sidebar ring-2 ring-sidebar",
                    apiOnline ? "bg-success" : "bg-destructive",
                  )}
                />
              </div>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate font-medium text-foreground group-hover:text-primary transition-colors">{APP_CONFIG.user.name}</span>
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  {apiOnline ? "Connected" : "API offline"}
                </span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56 bg-popover border-border/50">
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">Appearance</DropdownMenuLabel>
            {(
              [
                ["light", "Light", SunIcon],
                ["dark", "Dark", MoonIcon],
                ["system", "System", MonitorIcon],
              ] as const
            ).map(([value, label, Icon]) => (
              <DropdownMenuItem key={value} onSelect={() => setTheme(value)} className="gap-2">
                <Icon className="size-4" />
                {label}
                {theme === value && <CheckIcon className="ml-auto size-4 text-primary" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem
              variant="destructive"
              disabled={!conversations.length}
              onSelect={onClearAll}
              className="gap-2"
            >
              <Trash2Icon className="size-4" />
              Delete all chats
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}