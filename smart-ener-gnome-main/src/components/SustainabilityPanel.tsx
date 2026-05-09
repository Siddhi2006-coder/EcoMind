import { Card } from "@/components/ui/card";
import { Leaf, TreeDeciduous, Wind } from "lucide-react";
import type { ESG } from "@/lib/intelligence";

export function SustainabilityPanel({ esg, savingsPct }: { esg: ESG; savingsPct: number }) {
  return (
    <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Leaf className="h-5 w-5 text-success" />
        <div>
          <h3 className="text-base font-semibold">Sustainability & ESG Analytics</h3>
          <p className="text-xs text-muted-foreground">Real-time environmental impact dashboard</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="CO₂ saved" value={`${esg.co2SavedKg} kg`} sub="today projection" icon={Wind} />
        <Tile label="Trees equivalent" value={`${esg.treesEquivalent}`} sub="annual offset" icon={TreeDeciduous} />
        <Tile label="Renewable mix" value={`${esg.renewablePct}%`} sub="solar + grid" icon={Leaf} />
        <Tile label="ESG score" value={`${esg.esgScore}`} sub={`${savingsPct}% energy saved`} icon={Leaf} highlight />
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-gradient-to-r from-success to-primary transition-all"
          style={{ width: `${Math.min(100, esg.esgScore)}%` }}
        />
      </div>
    </Card>
  );
}

function Tile({
  label,
  value,
  sub,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof Leaf;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight ? "border-success/40 bg-success/10" : "border-border/60 bg-background/40"
      }`}
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {label}
        <Icon className="h-4 w-4 text-success" />
      </div>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}
