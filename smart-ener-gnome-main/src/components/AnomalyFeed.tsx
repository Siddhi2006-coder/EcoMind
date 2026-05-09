import { Card } from "@/components/ui/card";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import type { Anomaly } from "@/lib/intelligence";

export function AnomalyFeed({ items }: { items: Anomaly[] }) {
  return (
    <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-warning" />
        <div>
          <h3 className="text-base font-semibold">Anomaly Detection</h3>
          <p className="text-xs text-muted-foreground">Real-time deviations across all sensors</p>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
          ✓ All systems nominal — no anomalies detected.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((a) => (
            <div
              key={a.id}
              className={`flex items-start gap-3 rounded-lg border p-3 ${
                a.severity === "high"
                  ? "border-destructive/40 bg-destructive/10"
                  : a.severity === "medium"
                    ? "border-warning/40 bg-warning/10"
                    : "border-border bg-background/40"
              }`}
            >
              <AlertTriangle
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  a.severity === "high" ? "text-destructive" : a.severity === "medium" ? "text-warning" : "text-muted-foreground"
                }`}
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{a.type}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase">{a.zone}</span>
                  <span className="text-[10px] text-muted-foreground">{a.severity.toUpperCase()}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
