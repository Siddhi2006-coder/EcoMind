import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";
import type { ActivityEvent } from "@/lib/intelligence";

const tone: Record<ActivityEvent["kind"], string> = {
  optimization: "bg-primary/15 text-primary",
  ai: "bg-accent/15 text-accent-foreground",
  maintenance: "bg-warning/15 text-warning",
  anomaly: "bg-destructive/15 text-destructive",
  automation: "bg-success/15 text-success",
  emergency: "bg-destructive/20 text-destructive",
};

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-base font-semibold">Real-time Activity Feed</h3>
          <p className="text-xs text-muted-foreground">Unified system event stream</p>
        </div>
      </div>
      <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
        {events.length === 0 && (
          <p className="text-sm text-muted-foreground">Awaiting first events…</p>
        )}
        {events.map((e) => (
          <div key={e.id} className="flex items-start gap-3 rounded-lg border border-border/50 bg-background/40 p-2.5">
            <span className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${tone[e.kind]}`}>
              {e.kind}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium leading-tight">{e.title}</p>
              <p className="text-xs text-muted-foreground">{e.detail}</p>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {new Date(e.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
