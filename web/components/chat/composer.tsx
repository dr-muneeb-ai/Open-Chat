"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUpIcon, SquareIcon, PaperclipIcon, MicIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Composer({
  onSend,
  onStop,
  streaming,
  disabled,
  placeholder = `Message ${APP_CONFIG.appName}…`,
  autoFocus,
}: {
  onSend: (text: string) => void;
  onStop: () => void;
  streaming: boolean;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && window.matchMedia("(min-width: 768px)").matches) ref.current?.focus();
  }, [autoFocus]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (streaming) return onStop();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
    setFileName(null);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const touch = window.matchMedia("(hover: none)").matches;
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && !touch) {
      e.preventDefault();
      submit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = (event: any) => {
      if (event.error === "aborted") return;
      console.error("Speech recognition error", event.error);
    };
    recognition.start();
  };

  const canSend = streaming || (!!value.trim() && !disabled);

  return (
    <form
      onSubmit={submit}
      className="mx-auto w-full rounded-[2rem] border border-border/50 bg-background/60 backdrop-blur-xl p-3 pl-5 shadow-2xl transition-all duration-300 focus-within:border-primary/50 focus-within:ring-1 ring-primary/20"
    >
      <label htmlFor="composer" className="sr-only">
        Message
      </label>
      <textarea
        id="composer"
        ref={ref}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        enterKeyHint="send"
        className="field-sizing-content max-h-52 min-h-7 w-full resize-none bg-transparent py-2 text-[15px] leading-6 outline-none placeholder:text-muted-foreground/60"
      />
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="relative flex items-center gap-1">
            <input
              type="file"
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              title="Attach file"
            >
              <PaperclipIcon className="size-4" />
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
            title="Voice input"
            onClick={handleVoiceInput}
          >
            <MicIcon className="size-4" />
          </Button>
          {fileName && (
            <span className="ml-1 text-[11px] text-muted-foreground truncate max-w-[100px]">
              {fileName}
            </span>
          )}
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={!canSend}
          aria-label={streaming ? "Stop generating" : "Send message"}
          className={cn(
            "size-10 rounded-full transition-all duration-300",
            canSend
              ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--gold-primary),0.4)] hover:scale-105 active:scale-95"
              : "opacity-30 bg-muted"
          )}
        >
          {streaming ? <SquareIcon className="size-4 fill-current" /> : <ArrowUpIcon className="size-5" />}
        </Button>
      </div>
    </form>
  );
}
