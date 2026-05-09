import { Card } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface EnergyPoint {
  time: string;
  total: number;
  optimized: number;
}

export function EnergyTimeChart({ data }: { data: EnergyPoint[] }) {
  return (
    <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Energy usage over time</h3>
          <p className="text-xs text-muted-foreground">Live readings vs. optimized projection</p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-energy" />
            <span className="text-muted-foreground">Actual</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Optimized</span>
          </span>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--energy))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--energy))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="total" stroke="hsl(var(--energy))" strokeWidth={2} fill="url(#actualGrad)" />
            <Area type="monotone" dataKey="optimized" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#optGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
