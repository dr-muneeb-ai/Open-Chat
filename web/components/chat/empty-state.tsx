"use client";

import { useEffect, useState } from "react";
import {
  CodeIcon,
  LightbulbIcon,
  MailIcon,
  ListChecksIcon,
  MessageSquareIcon,
  SparklesIcon,
  FileSearchIcon,
  GlobeIcon
} from "lucide-react";

import { APP_CONFIG, firstNameOf } from "@/lib/config";

const SUGGESTIONS = [
  {
    icon: MessageSquareIcon,
    title: "Ask Anything",
    sub: "Get answers to your questions",
    prompt: "I have a question about AI. Can you explain the basic principles?",
  },
  {
    icon: CodeIcon,
    title: "Write Code",
    sub: "Build, debug, and explain",
    prompt: "Write a debounce function in TypeScript and explain how it works.",
  },
  {
    icon: FileSearchIcon,
    title: "Analyze a File",
    sub: "Upload & get insights",
    prompt: "Can you help me analyze this document for key takeaways?",
  },
  {
    icon: SparklesIcon,
    title: "Create Something",
    sub: "Images, ideas, designs",
    prompt: "Give me 5 creative ideas for a new AI-powered productivity app.",
  },
  {
    icon: GlobeIcon,
    title: "Search the Web",
    sub: "Real-time information",
    prompt: "What are the latest breakthroughs in quantum computing from this month?",
  },
  {
    icon: LightbulbIcon,
    title: "Explain a Concept",
    sub: "Learn step by step",
    prompt: "Explain how large language models work in simple terms.",
  },
];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export function EmptyState() {
  const [hello, setHello] = useState("Hello");
  useEffect(() => setHello(greeting()), []);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-700">
      <div className="relative group">
        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
        <div className="relative size-24 grid place-items-center rounded-2xl bg-[#544D4F] text-primary-foreground shadow-xl rotate-12 group-hover:rotate-0 transition-all duration-500 overflow-hidden">
          <img
            src="/logo.png"
            alt="Logo"
            className="relative z-10 size-full object-contain"
          />

          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20 mix-blend-multiply opacity-90"
            viewBox="0 0 96 96"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="dripGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8a1c26" />
                <stop offset="60%" stopColor="#5c1017" />
                <stop offset="100%" stopColor="#3a0a0f" />
              </linearGradient>
              <linearGradient id="dripShine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path d="M14,0 Q16,22 12,30 Q9,33 10,38 Q9,44 14,45 Q19,44 18,38 Q19,33 16,30 Q20,22 18,0 Z" fill="url(#dripGrad)" />
            <path d="M14,0 Q15,20 13,29 L15,29 Q17,20 16,0 Z" fill="url(#dripShine)" />

            <path d="M40,0 Q43,28 37,42 Q33,46 34,53 Q33,60 40,61 Q47,60 46,53 Q47,46 43,42 Q47,28 44,0 Z" fill="url(#dripGrad)" />
            <path d="M40,0 Q41,25 38,40 L40,40 Q43,25 42,0 Z" fill="url(#dripShine)" />

            <path d="M68,0 Q70,18 66,24 Q63,27 64,31 Q63,36 68,37 Q73,36 72,31 Q73,27 70,24 Q74,18 72,0 Z" fill="url(#dripGrad)" />
            <path d="M68,0 Q69,16 67,23 L69,23 Q71,16 70,0 Z" fill="url(#dripShine)" />

            <path d="M84,0 Q85,10 83,14 Q82,16 83,18 L85,18 Q86,16 85,14 Q87,10 86,0 Z" fill="url(#dripGrad)" />
          </svg>
        </div>
      </div>

      <div className="space-y-2 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
          Welcome to Death of Justice
        </h1>
        <p className="text-lg text-muted-foreground">
          Have no fear, Where Kira is here
        </p>
      </div>
    </div>
  );
}

export function SuggestionGrid({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="mx-auto mt-12 grid w-full max-w-4xl grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
      {SUGGESTIONS.map(({ icon: Icon, title, sub, prompt }, i) => (
        <button
          key={title}
          type="button"
          onClick={() => onPick(prompt)}
          className="group relative flex items-start gap-4 rounded-2xl border border-border/50 bg-background/40 p-5 text-left transition-all duration-300 hover:bg-accent/50 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--gold-primary),0.15)] backdrop-blur-sm"
        >
          <div className="mt-1 size-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <Icon className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{title}</span>
            <span className="block text-[13px] text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">{sub}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
