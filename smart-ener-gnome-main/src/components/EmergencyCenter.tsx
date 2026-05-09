import { Card } from "@/components/ui/card";
import { Siren } from "lucide-react";
import type { EmergencyEvent } from "@/lib/intelligence";

export function EmergencyCenter({ events }: { events: EmergencyEvent[] }) {
  return (
    <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Siren className="h-5 w-5 text-destructive" />
        <div>
          <h3 className="text-base font-semibold">Emergency Intelligence</h3>
          <p className="text-xs text-muted-foreground">Smoke · fire · overheat · evacuation</p>
        </div>
      </div>
      {events.length === 0 ? (
        <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
          ✓ No active emergencies. Suppression and ventilation systems armed.
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((e) => (
            <div
              key={e.id}
              className={`rounded-lg border p-3 ${
                e.severity === "critical"
                  ? "border-destructive/50 bg-destructive/15"
                  : e.severity === "warning"
                    ? "border-warning/50 bg-warning/15"
                    : "border-border bg-background/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wide">{e.type}</span>
                <span className="text-[11px] text-muted-foreground">{e.zone}</span>
              </div>
              <p className="mt-1 text-xs">{e.message}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Recommended: initiate evacuation protocol & alert facility manager.
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
