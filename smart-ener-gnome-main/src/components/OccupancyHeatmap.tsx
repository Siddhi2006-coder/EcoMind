import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { ZoneOccupancy } from "@/lib/intelligence";

export function OccupancyHeatmap({ data }: { data: ZoneOccupancy[] }) {
  const heat = (d: number) => {
    if (d > 80) return "bg-destructive/30 border-destructive/60 text-destructive-foreground";
    if (d > 60) return "bg-warning/30 border-warning/60";
    if (d > 35) return "bg-primary/25 border-primary/50";
    return "bg-success/15 border-success/40";
  };
  return (
    <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-base font-semibold">Occupancy Intelligence</h3>
          <p className="text-xs text-muted-foreground">Floor-wise crowd density · adaptive optimization input</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {data.map((z) => (
          <div key={z.zone} className={`rounded-xl border p-3 transition ${heat(z.density)}`}>
            <p className="text-[11px] uppercase tracking-wide opacity-80">F{z.floor}</p>
            <p className="text-sm font-semibold leading-tight">{z.zone}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums">{z.density}</span>
              <span className="text-xs opacity-80">% density</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
