import { Card } from "@/components/ui/card";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--energy))", "hsl(var(--warning))", "hsl(var(--success))"];

export function ZoneDistribution({
  data,
}: {
  data: { zone: string; kw: number }[];
}) {
  return (
    <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
      <h3 className="mb-1 text-base font-semibold">Zone consumption</h3>
      <p className="mb-4 text-xs text-muted-foreground">Live load by area (kW)</p>
      <div className="h-60 w-full">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="zone" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Bar dataKey="kw" radius={[8, 8, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function DistributionPie({
  data,
}: {
  data: { zone: string; kw: number }[];
}) {
  return (
    <Card className="border-border/60 bg-gradient-card p-5 shadow-card">
      <h3 className="mb-1 text-base font-semibold">Energy distribution</h3>
      <p className="mb-4 text-xs text-muted-foreground">Share of total load</p>
      <div className="h-60 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="kw"
              nameKey="zone"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={3}
              stroke="hsl(var(--background))"
              strokeWidth={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
