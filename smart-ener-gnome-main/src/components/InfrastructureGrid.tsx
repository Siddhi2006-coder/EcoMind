import { Card } from "@/components/ui/card";
import {
  Building, ShoppingBag, UtensilsCrossed, Film, Car, MoveVertical, Wind, Lightbulb,
  Bath, Gamepad2, Baby, Box, Server, Siren, Sun, Droplets, ShieldCheck, Monitor,
} from "lucide-react";
import type { SensorReading } from "@/lib/simulator";

type Module = {
  id: string;
  name: string;
  icon: typeof Building;
  metric: string;
  status: "ok" | "warn" | "crit";
  insight: string;
};

export function InfrastructureGrid({ r }: { r: SensorReading }) {
  const mods: Module[] = [
    { id: "lobby", name: "Entrance & Lobby", icon: Building, metric: `${(r.parking_occupancy * 0.9).toFixed(0)} ppl/min`, status: "ok", insight: "Foot traffic nominal" },
    { id: "shops", name: "Retail Shops", icon: ShoppingBag, metric: r.shops_active ? "Active" : "Closed", status: r.shops_active ? "ok" : "warn", insight: "Lighting auto-dimmed off-hours" },
    { id: "food", name: "Food Court", icon: UtensilsCrossed, metric: `${r.hvac_temp.toFixed(1)}°C`, status: r.hvac_temp > 25 ? "warn" : "ok", insight: "Ventilation balanced" },
    { id: "cinema", name: "Multiplex", icon: Film, metric: "5 screens", status: "ok", insight: "HVAC scheduled per show" },
    { id: "parking", name: "Parking", icon: Car, metric: `${r.parking_occupancy.toFixed(0)}% full`, status: r.parking_occupancy > 90 ? "crit" : r.parking_occupancy > 70 ? "warn" : "ok", insight: "Lighting follows occupancy" },
    { id: "lifts", name: "Escalators & Lifts", icon: MoveVertical, metric: `${r.lifts_load.toFixed(0)}% load`, status: r.lifts_load > 85 ? "warn" : "ok", insight: "Idle shutdown after 4 min" },
    { id: "hvac", name: "HVAC Systems", icon: Wind, metric: `${r.hvac_load.toFixed(0)}%`, status: r.hvac_load > 85 ? "crit" : r.hvac_load > 70 ? "warn" : "ok", insight: "Zone balancing active" },
    { id: "light", name: "Lighting Infra", icon: Lightbulb, metric: `${r.lighting.toFixed(0)}%`, status: r.lighting > 90 ? "warn" : "ok", insight: "Daylight harvesting on" },
    { id: "wash", name: "Smart Washrooms", icon: Bath, metric: "Auto", status: "ok", insight: "Sensor flush + lighting" },
    { id: "gaming", name: "Gaming Zone", icon: Gamepad2, metric: "Live", status: "ok", insight: "Power capped 22kW" },
    { id: "kids", name: "Kids Play Area", icon: Baby, metric: "Safe", status: "ok", insight: "Air quality monitored" },
    { id: "storage", name: "Storage Rooms", icon: Box, metric: "Idle", status: "ok", insight: "Motion-only lighting" },
    { id: "server", name: "Server Rooms", icon: Server, metric: `${r.hvac_temp.toFixed(1)}°C`, status: r.hvac_temp > 25 ? "crit" : "ok", insight: "Critical cooling priority" },
    { id: "emergency", name: "Emergency Systems", icon: Siren, metric: "Armed", status: "ok", insight: "Suppression online" },
    { id: "solar", name: "Solar Energy", icon: Sun, metric: "32 kW", status: "ok", insight: "Roof PV harvesting" },
    { id: "water", name: "Water Management", icon: Droplets, metric: "Normal", status: "ok", insight: "Greywater recycle 38%" },
    { id: "sec", name: "Security & CCTV", icon: ShieldCheck, metric: "All clear", status: "ok", insight: "AI person-tracking" },
    { id: "ads", name: "Digital Signage", icon: Monitor, metric: r.shops_active ? "On" : "Eco", status: "ok", insight: "Brightness auto-adapt" },
  ];

  const dot = (s: Module["status"]) =>
    s === "crit" ? "bg-destructive" : s === "warn" ? "bg-warning" : "bg-success";

  return (
    <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Smart Mall Infrastructure</h3>
        <p className="text-xs text-muted-foreground">All 18 monitored subsystems · click any tile for AI insights</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mods.map((m) => (
          <div
            key={m.id}
            className="group relative overflow-hidden rounded-xl border border-border/60 bg-background/40 p-3 transition hover:border-primary/40 hover:shadow-glow"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <m.icon className="h-5 w-5" />
              </div>
              <span className={`h-2 w-2 rounded-full ${dot(m.status)} animate-pulse`} />
            </div>
            <p className="mt-2 text-sm font-semibold">{m.name}</p>
            <p className="text-[11px] text-muted-foreground">{m.insight}</p>
            <p className="mt-1.5 text-base font-bold tabular-nums text-primary">{m.metric}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
