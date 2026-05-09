import { Card } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import type { MaintenanceItem } from "@/lib/intelligence";

export function PredictiveMaintenance({ items }: { items: MaintenanceItem[] }) {
  return (
    <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Wrench className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-base font-semibold">Predictive Maintenance</h3>
          <p className="text-xs text-muted-foreground">AI health scores & failure probabilities</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => {
          const tone =
            m.urgency === "high"
              ? "border-destructive/40 bg-destructive/5"
              : m.urgency === "medium"
                ? "border-warning/40 bg-warning/5"
                : "border-border bg-background/40";
          const bar =
            m.health > 75 ? "bg-success" : m.health > 50 ? "bg-warning" : "bg-destructive";
          return (
            <div key={m.system} className={`rounded-xl border p-3 ${tone}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{m.system}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                    m.urgency === "high"
                      ? "bg-destructive/20 text-destructive"
                      : m.urgency === "medium"
                        ? "bg-warning/20 text-warning"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {m.urgency}
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between text-xs text-muted-foreground">
                <span>Health</span>
                <span className="font-semibold text-foreground">{m.health}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className={`h-full ${bar} transition-all`} style={{ width: `${m.health}%` }} />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Failure prob <span className="font-semibold text-foreground">{(m.failureProb * 100).toFixed(0)}%</span> · {m.note}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
