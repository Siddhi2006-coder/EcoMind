import { Card } from "@/components/ui/card";
import type { SensorReading } from "@/lib/simulator";
import { totalEnergy } from "@/lib/simulator";

type Zone = { id: string; label: string; x: number; y: number; w: number; h: number; status: "ok" | "warn" | "crit" };

export function DigitalTwin({ r }: { r: SensorReading }) {
  const total = totalEnergy(r);
  const status = (cond: boolean, warn: boolean): Zone["status"] => (cond ? "crit" : warn ? "warn" : "ok");

  const zones: Zone[] = [
    { id: "lobby", label: "Lobby", x: 4, y: 4, w: 28, h: 14, status: status(false, r.parking_occupancy > 80) },
    { id: "shops", label: "Retail Shops", x: 34, y: 4, w: 36, h: 14, status: status(!r.shops_active, r.lighting > 90) },
    { id: "food", label: "Food Court", x: 72, y: 4, w: 24, h: 14, status: status(r.hvac_temp > 26, r.hvac_temp > 24) },
    { id: "hvac", label: "HVAC Core", x: 4, y: 20, w: 22, h: 18, status: status(r.hvac_load > 85, r.hvac_load > 70) },
    { id: "cinema", label: "Multiplex", x: 28, y: 20, w: 28, h: 18, status: status(false, false) },
    { id: "gaming", label: "Gaming", x: 58, y: 20, w: 18, h: 18, status: status(false, false) },
    { id: "kids", label: "Kids Play", x: 78, y: 20, w: 18, h: 18, status: status(false, false) },
    { id: "lifts", label: "Lifts & Escalators", x: 4, y: 40, w: 28, h: 12, status: status(r.lifts_load > 90, r.lifts_load > 75) },
    { id: "wash", label: "Washrooms", x: 34, y: 40, w: 18, h: 12, status: "ok" },
    { id: "server", label: "Server Room", x: 54, y: 40, w: 18, h: 12, status: status(r.hvac_temp > 26, r.hvac_temp > 24) },
    { id: "storage", label: "Storage", x: 74, y: 40, w: 22, h: 12, status: "ok" },
    { id: "parking", label: "Parking", x: 4, y: 54, w: 92, h: 16, status: status(r.parking_occupancy > 95, r.parking_occupancy > 80) },
    { id: "solar", label: "Solar Roof", x: 4, y: 72, w: 44, h: 10, status: "ok" },
    { id: "emergency", label: "Emergency Systems", x: 50, y: 72, w: 46, h: 10, status: status(total > 270, total > 220) },
  ];

  const color = (s: Zone["status"]) =>
    s === "crit"
      ? "fill-destructive/30 stroke-destructive"
      : s === "warn"
        ? "fill-warning/25 stroke-warning"
        : "fill-success/15 stroke-success";

  return (
    <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Digital Twin · Live Mall Map</h3>
          <p className="text-xs text-muted-foreground">2D real-time spatial view of every zone</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Optimized</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> Warning</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" /> Critical</span>
        </div>
      </div>
      <div className="rounded-xl border border-border/60 bg-background/40 p-2">
        <svg viewBox="0 0 100 86" className="h-[360px] w-full">
          <defs>
            <linearGradient id="flow" x1="0" x2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {zones.map((z) => (
            <g key={z.id}>
              <rect
                x={z.x}
                y={z.y}
                width={z.w}
                height={z.h}
                rx={1.2}
                strokeWidth={0.3}
                className={`${color(z.status)} transition-all`}
              />
              <text x={z.x + 1.2} y={z.y + 3.2} className="fill-foreground" style={{ fontSize: 2.2, fontWeight: 600 }}>
                {z.label}
              </text>
              {z.status !== "ok" && (
                <circle cx={z.x + z.w - 2} cy={z.y + 2} r={0.9} className={z.status === "crit" ? "fill-destructive" : "fill-warning"}>
                  <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          ))}
          <line x1="2" y1="86" x2="98" y2="86" stroke="url(#flow)" strokeWidth="0.8">
            <animate attributeName="x1" values="-20;120" dur="4s" repeatCount="indefinite" />
            <animate attributeName="x2" values="0;140" dur="4s" repeatCount="indefinite" />
          </line>
        </svg>
      </div>
    </Card>
  );
}
