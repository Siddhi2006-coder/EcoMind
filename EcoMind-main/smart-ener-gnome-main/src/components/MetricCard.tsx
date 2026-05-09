import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  accent?: "primary" | "accent" | "energy" | "warning" | "success";
  sub?: string;
  pulse?: boolean;
}

const accentMap = {
  primary: "from-primary/20 to-primary/5 text-primary",
  accent: "from-accent/20 to-accent/5 text-accent",
  energy: "from-energy/20 to-energy/5 text-energy",
  warning: "from-warning/20 to-warning/5 text-warning",
  success: "from-success/20 to-success/5 text-success",
};

export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  accent = "primary",
  sub,
  pulse,
}: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/60 bg-gradient-card p-5 shadow-card transition-smooth hover:shadow-elevated">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", accentMap[accent])} />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold tabular-nums text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {sub && (
            <p className={cn("mt-1 text-xs", pulse && "pulse-dot")}>
              <span className="text-muted-foreground">{sub}</span>
            </p>
          )}
        </div>
        <div className={cn("rounded-xl bg-background/60 p-2.5 backdrop-blur", accentMap[accent].split(" ").pop())}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
