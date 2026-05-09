import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OptimizationResult, Recommendation } from "@/lib/optimizer";

const sevConfig: Record<
  Recommendation["severity"],
  { icon: typeof Info; classes: string; label: string }
> = {
  info: { icon: Info, classes: "text-accent border-accent/30 bg-accent/10", label: "INFO" },
  warning: { icon: AlertTriangle, classes: "text-warning border-warning/30 bg-warning/10", label: "WARNING" },
  critical: { icon: ShieldAlert, classes: "text-destructive border-destructive/30 bg-destructive/10", label: "CRITICAL" },
  success: { icon: CheckCircle2, classes: "text-success border-success/30 bg-success/10", label: "OK" },
};

const statusConfig = {
  optimal: { dot: "text-success", label: "Optimal", grad: "bg-gradient-eco" },
  warning: { dot: "text-warning", label: "Attention", grad: "bg-gradient-energy" },
  critical: { dot: "text-destructive", label: "Critical", grad: "bg-gradient-energy" },
};

export function OptimizationPanel({ result }: { result: OptimizationResult }) {
  const status = statusConfig[result.status];

  return (
    <Card className="overflow-hidden border-border/60 bg-gradient-card shadow-card">
      <div className={cn("relative px-5 py-4 text-primary-foreground", status.grad)}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider opacity-90">
              Optimization Engine
            </p>
            <h3 className="mt-1 text-2xl font-bold">
              {result.savingsPct}% potential savings
            </h3>
            <p className="mt-1 text-sm opacity-90">
              {result.before.toFixed(1)} kW → {result.after.toFixed(1)} kW
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={cn("pulse-dot text-sm font-semibold", status.dot.replace("text-", "text-primary-foreground"))}>
              {status.label}
            </span>
            <Badge variant="secondary" className="bg-background/20 text-primary-foreground border-0">
              {result.recommendations.length} insights
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2 p-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Recommendations
        </p>
        {result.recommendations.map((r) => {
          const cfg = sevConfig[r.severity];
          const Icon = cfg.icon;
          return (
            <div
              key={r.id}
              className={cn(
                "flex gap-3 rounded-xl border p-3 transition-smooth",
                cfg.classes,
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider">
                    {cfg.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    · {r.zone}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-foreground">{r.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
