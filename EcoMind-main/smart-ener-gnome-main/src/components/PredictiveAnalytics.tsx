import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Zap } from "lucide-react";
import type { Forecast } from "@/lib/intelligence";

export function PredictiveAnalytics({ f }: { f: Forecast }) {
  return (
    <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-base font-semibold">Predictive AI Analytics</h3>
            <p className="text-xs text-muted-foreground">12-hour load forecast with confidence band</p>
          </div>
        </div>
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
          Confidence {(f.confidence * 100).toFixed(0)}%
        </Badge>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        <Stat label="Next hour" value={`${f.nextHourKw} kW`} icon={Zap} />
        <Stat label="Tomorrow" value={`${f.tomorrowKwh} kWh`} icon={TrendingUp} />
        <Stat label="Peak hour" value={f.peakHour} icon={TrendingUp} />
        <Stat label="Anomaly prob" value={`${(f.anomalyProb * 100).toFixed(0)}%`} icon={Brain} />
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={f.series}>
          <defs>
            <linearGradient id="band" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="t" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Area type="monotone" dataKey="upper" stroke="transparent" fill="url(#band)" />
          <Area type="monotone" dataKey="lower" stroke="transparent" fill="hsl(var(--background))" />
          <Area type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="transparent" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Zap }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {label}
        <Icon className="h-3.5 w-3.5" />
      </div>
      <p className="mt-1 text-lg font-bold tabular-nums">{value}</p>
    </div>
  );
}
