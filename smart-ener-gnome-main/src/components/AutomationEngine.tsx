import { Card } from "@/components/ui/card";
import { Cpu, CheckCircle2 } from "lucide-react";
import type { AutomationAction } from "@/lib/intelligence";

export function AutomationEngine({ actions }: { actions: AutomationAction[] }) {
  return (
    <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Cpu className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-base font-semibold">Smart Automation Engine</h3>
          <p className="text-xs text-muted-foreground">Auto-executed optimizations · live timeline</p>
        </div>
      </div>
      {actions.length === 0 ? (
        <p className="rounded-lg border border-border bg-background/40 p-3 text-sm text-muted-foreground">
          No automation triggers active. System operating in steady state.
        </p>
      ) : (
        <ol className="relative space-y-2 border-l border-border/60 pl-4">
          {actions.map((a) => (
            <li key={a.id} className="relative">
              <span className="absolute -left-[19px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary shadow-glow" />
              <div className="rounded-lg border border-border/60 bg-background/40 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{a.action}</p>
                  <span className="flex items-center gap-1 text-[11px] text-success">
                    <CheckCircle2 className="h-3 w-3" /> {a.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Target: <span className="text-foreground">{a.target}</span> · {a.details}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
