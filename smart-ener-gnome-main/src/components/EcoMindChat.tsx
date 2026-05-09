import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK = [
  "Why is HVAC usage high?",
  "Which zone wastes the most energy?",
  "Suggest optimizations.",
  "Predict tomorrow's load.",
  "Which systems need maintenance?",
  "Show sustainability insights.",
];

export function EcoMindChat({ context }: { context: Record<string, unknown> }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm **EcoMind AI** — your smart-mall energy assistant. Ask me about anomalies, optimizations, predictions, or sustainability.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [messages, open]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ecomind-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          context,
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast({ title: "Rate limit hit", description: "Please retry in a moment." });
        else if (resp.status === 402) toast({ title: "AI credits exhausted", description: "Add funds in workspace settings." });
        else toast({ title: "EcoMind unavailable", description: "Try again shortly." });
        setBusy(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") {
            done = true;
            break;
          }
          try {
            const p = JSON.parse(j);
            const c = p.choices?.[0]?.delta?.content;
            if (c) {
              acc += c;
              setMessages((m) => m.map((mm, i) => (i === m.length - 1 ? { ...mm, content: acc } : mm)));
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
      void supabase.from("chatbot_logs").insert([
        { role: "user", message: text, context: context as never },
        { role: "assistant", message: acc, context: null as never },
      ]);
    } catch (e) {
      console.error(e);
      toast({ title: "EcoMind error", description: String(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground shadow-glow transition hover:scale-105"
        aria-label="Open EcoMind AI"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {open && (
        <Card className="fixed bottom-24 right-6 z-50 flex h-[560px] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden border-border/60 bg-background/95 shadow-elevated backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-border/60 bg-gradient-hero p-3 text-primary-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-none">EcoMind AI</p>
              <p className="text-xs opacity-90">Smart-mall energy assistant</p>
            </div>
            <Badge variant="outline" className="border-background/40 bg-background/15 text-primary-foreground">
              Live
            </Badge>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="ml-4 list-disc space-y-0.5">{children}</ul>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  }}
                >
                  {m.content || (busy && i === messages.length - 1 ? "▍" : "")}
                </ReactMarkdown>
              </div>
            ))}
          </div>

          <div className="border-t border-border/60 p-2">
            <div className="mb-2 flex flex-wrap gap-1">
              {QUICK.slice(0, 4).map((q) => (
                <button
                  key={q}
                  disabled={busy}
                  onClick={() => send(q)}
                  className="rounded-full border border-border bg-card px-2 py-1 text-[11px] text-muted-foreground transition hover:border-primary hover:text-foreground disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask EcoMind…"
                disabled={busy}
              />
              <Button type="submit" size="icon" disabled={busy || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
