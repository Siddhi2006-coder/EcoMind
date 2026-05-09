import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, Building2, Car, Gauge, Leaf, Lightbulb, RefreshCw, Sparkles,
  Store, Thermometer, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { generateReading, totalEnergy, type SensorReading } from "@/lib/simulator";
import { optimize, type OptimizationResult } from "@/lib/optimizer";
import { supabase } from "@/integrations/supabase/client";
import { MetricCard } from "@/components/MetricCard";
import { EnergyTimeChart, type EnergyPoint } from "@/components/EnergyCharts";
import { ZoneDistribution, DistributionPie } from "@/components/ZoneCharts";
import { OptimizationPanel } from "@/components/OptimizationPanel";
import { EcoMindChat } from "@/components/EcoMindChat";
import { DigitalTwin } from "@/components/DigitalTwin";
import { PredictiveAnalytics } from "@/components/PredictiveAnalytics";
import { OccupancyHeatmap } from "@/components/OccupancyHeatmap";
import { AnomalyFeed } from "@/components/AnomalyFeed";
import { PredictiveMaintenance } from "@/components/PredictiveMaintenance";
import { AutomationEngine } from "@/components/AutomationEngine";
import { EmergencyCenter } from "@/components/EmergencyCenter";
import { SustainabilityPanel } from "@/components/SustainabilityPanel";
import { ActivityFeed } from "@/components/ActivityFeed";
import { InfrastructureGrid } from "@/components/InfrastructureGrid";
import {
  forecastEnergy, zoneOccupancy, detectAnomalies, maintenance,
  suggestAutomations, emergencyScan, sustainability, type ActivityEvent,
} from "@/lib/intelligence";

const POLL_MS = 4000;
const MAX_POINTS = 24;
const LOG_EVERY_N = 3;

const Index = () => {
  const [reading, setReading] = useState<SensorReading>(() => generateReading());
  const [ecoMode, setEcoMode] = useState(false);
  const [history, setHistory] = useState<EnergyPoint[]>([]);
  const [paused, setPaused] = useState(false);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const tickRef = useRef(0);

  const result: OptimizationResult = useMemo(() => optimize(reading, ecoMode), [reading, ecoMode]);
  const forecast = useMemo(
    () => forecastEnergy(history.map((h) => h.total), totalEnergy(reading)),
    [history, reading],
  );
  const occupancy = useMemo(() => zoneOccupancy(reading), [reading]);
  const anomalies = useMemo(() => detectAnomalies(reading), [reading]);
  const maint = useMemo(() => maintenance(reading), [reading]);
  const automations = useMemo(() => suggestAutomations(reading), [reading]);
  const emergencies = useMemo(() => emergencyScan(reading), [reading]);
  const esg = useMemo(() => sustainability(result.before - result.after, ecoMode), [result, ecoMode]);

  const addActivity = useCallback((e: Omit<ActivityEvent, "id" | "ts">) => {
    setActivity((a) => [{ id: crypto.randomUUID(), ts: Date.now(), ...e }, ...a].slice(0, 30));
  }, []);

  const tick = useCallback(async () => {
    const r = generateReading();
    setReading(r);
    const opt = optimize(r, ecoMode);
    setHistory((h) =>
      [
        ...h,
        {
          time: new Date(r.timestamp).toLocaleTimeString([], {
            hour: "2-digit", minute: "2-digit", second: "2-digit",
          }),
          total: opt.before,
          optimized: opt.after,
        },
      ].slice(-MAX_POINTS),
    );

    const a = detectAnomalies(r);
    if (a.length > 0)
      addActivity({ kind: "anomaly", title: a[0].type, detail: `${a[0].zone} · ${a[0].description}` });
    const auto = suggestAutomations(r);
    if (auto.length > 0)
      addActivity({ kind: "automation", title: auto[0].action, detail: auto[0].details });
    const em = emergencyScan(r);
    if (em.length > 0)
      addActivity({ kind: "emergency", title: em[0].type.toUpperCase(), detail: em[0].message });

    tickRef.current += 1;
    if (tickRef.current % LOG_EVERY_N === 0) {
      void supabase.from("energy_logs").insert({
        lighting: r.lighting, hvac_temp: r.hvac_temp, hvac_load: r.hvac_load,
        parking_occupancy: r.parking_occupancy, shops_active: r.shops_active,
        lifts_load: r.lifts_load, total_energy: opt.before, optimized_energy: opt.after,
        savings_pct: opt.savingsPct, eco_mode: ecoMode,
      });
      if (a[0])
        void supabase.from("anomaly_logs").insert({
          zone: a[0].zone, type: a[0].type, severity: a[0].severity,
          description: a[0].description, value: a[0].value,
        });
      if (auto[0])
        void supabase.from("automation_logs").insert({
          action: auto[0].action, target: auto[0].target, status: auto[0].status, details: auto[0].details,
        });
      void supabase.from("sustainability_logs").insert({
        co2_saved_kg: esg.co2SavedKg, trees_equivalent: esg.treesEquivalent,
        renewable_pct: esg.renewablePct, esg_score: esg.esgScore,
      });
    }
  }, [ecoMode, addActivity, esg.co2SavedKg, esg.treesEquivalent, esg.renewablePct, esg.esgScore]);

  useEffect(() => {
    const seed: EnergyPoint[] = [];
    for (let i = 0; i < 8; i++) {
      const r = generateReading();
      const o = optimize(r, false);
      seed.push({
        time: new Date(r.timestamp).toLocaleTimeString([], {
          hour: "2-digit", minute: "2-digit", second: "2-digit",
        }),
        total: o.before, optimized: o.after,
      });
    }
    setHistory(seed);
    addActivity({ kind: "ai", title: "EcoMind AI online", detail: "Predictive engine warmed up" });
  }, [addActivity]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(tick, POLL_MS);
    return () => clearInterval(id);
  }, [tick, paused]);

  const zoneData = useMemo(() => {
    const r = reading;
    return [
      { zone: "Lighting", kw: +(r.lighting * 1.2 / 10).toFixed(1) },
      { zone: "HVAC", kw: +(r.hvac_load * 2.5 / 10).toFixed(1) },
      { zone: "Parking", kw: +(r.parking_occupancy * 0.8 / 10).toFixed(1) },
      { zone: "Lifts", kw: +(r.lifts_load * 1.0 / 10).toFixed(1) },
      { zone: "Shops", kw: r.shops_active ? 30 : 5 },
    ];
  }, [reading]);

  const totalKw = totalEnergy(reading);

  const aiContext = {
    reading, optimization: result, forecast, anomalies, maintenance: maint,
    automations, emergencies, esg, totalKw,
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-hero shadow-glow">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight md:text-2xl">Smart Mall Energy</h1>
              <p className="text-xs text-muted-foreground">IoT Monitoring · AI Optimization · Digital Twin</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="pulse-dot border-success/40 bg-success/10 text-success">
              {paused ? "Paused" : "Live"} · IoT feed
            </Badge>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5">
              <Leaf className={`h-4 w-4 ${ecoMode ? "text-success" : "text-muted-foreground"}`} />
              <Label htmlFor="eco" className="text-xs font-medium">Eco Mode</Label>
              <Switch
                id="eco"
                checked={ecoMode}
                onCheckedChange={(v) => {
                  setEcoMode(v);
                  addActivity({
                    kind: "optimization",
                    title: v ? "Eco Mode enabled" : "Eco Mode disabled",
                    detail: v ? "Lighting -15%, HVAC -10% applied" : "Standard optimization restored",
                  });
                  toast({
                    title: v ? "Eco Mode enabled" : "Eco Mode disabled",
                    description: v
                      ? "Lighting -15%, HVAC -10% applied to optimization."
                      : "Standard optimization restored.",
                  });
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container space-y-6 py-6">
        {/* Hero */}
        <Card className="relative overflow-hidden border-0 bg-gradient-hero p-6 text-primary-foreground shadow-elevated md:p-8">
          <div className="relative z-10 grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wider opacity-90">Total mall load</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-bold tabular-nums md:text-6xl">{totalKw.toFixed(1)}</span>
                <span className="text-xl opacity-90">kW</span>
              </div>
              <p className="mt-2 max-w-md text-sm opacity-90">
                Live aggregate across lighting, HVAC, parking, lifts and shops — sampled every {POLL_MS / 1000}s.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="secondary" className="border-0 bg-background/15 text-primary-foreground hover:bg-background/25"
                  onClick={() => { void tick(); toast({ title: "Live data refreshed" }); }}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Fetch live data
                </Button>
                <Button variant="secondary" className="border-0 bg-background/15 text-primary-foreground hover:bg-background/25"
                  onClick={() => {
                    addActivity({ kind: "optimization", title: `Optimization run · ${result.savingsPct}% savings`, detail: `${result.recommendations.length} recommendations` });
                    toast({ title: `Optimization complete · ${result.savingsPct}% savings`, description: `${result.recommendations.length} recommendations generated.` });
                  }}>
                  <Sparkles className="mr-2 h-4 w-4" /> Run optimization
                </Button>
                <Button variant="secondary" className="border-0 bg-background/15 text-primary-foreground hover:bg-background/25"
                  onClick={() => setPaused((p) => !p)}>
                  <Activity className="mr-2 h-4 w-4" /> {paused ? "Resume feed" : "Pause feed"}
                </Button>
              </div>
            </div>
            <div className="rounded-2xl bg-background/15 p-5 backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider opacity-90">Optimized projection</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold tabular-nums">{result.after.toFixed(1)}</span>
                <span className="text-base opacity-90">kW</span>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-success/30 px-3 py-2">
                <Leaf className="h-4 w-4" />
                <span className="text-sm font-semibold">{result.savingsPct}% energy saved</span>
              </div>
              <p className="mt-3 text-xs opacity-80">
                Status: <span className="font-semibold capitalize">{result.status}</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Metric cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Lighting" value={reading.lighting.toFixed(0)} unit="%" icon={Lightbulb} accent="energy" sub="Brightness usage" pulse />
          <MetricCard label="HVAC" value={reading.hvac_temp.toFixed(1)} unit="°C" icon={Thermometer} accent="accent" sub={`Load ${reading.hvac_load.toFixed(0)}%`} pulse />
          <MetricCard label="Parking" value={reading.parking_occupancy.toFixed(0)} unit="%" icon={Car} accent="primary" sub="Occupancy" pulse />
          <MetricCard label="Shops" value={reading.shops_active ? "Open" : "Closed"} icon={Store} accent={reading.shops_active ? "success" : "warning"} sub={reading.shops_active ? "All retail active" : "Off-hours · low draw"} />
        </div>

        {/* Tabbed advanced modules */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-card/60 p-1 backdrop-blur">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="twin">Digital Twin</TabsTrigger>
            <TabsTrigger value="predict">Predictive AI</TabsTrigger>
            <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
            <TabsTrigger value="anomaly">Anomalies</TabsTrigger>
            <TabsTrigger value="maint">Maintenance</TabsTrigger>
            <TabsTrigger value="auto">Automation</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="esg">Sustainability</TabsTrigger>
            <TabsTrigger value="infra">Infrastructure</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2"><EnergyTimeChart data={history} /></div>
              <OptimizationPanel result={result} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <ZoneDistribution data={zoneData} />
              <DistributionPie data={zoneData} />
            </div>
            <ActivityFeed events={activity} />
          </TabsContent>

          <TabsContent value="twin" className="mt-4">
            <DigitalTwin r={reading} />
          </TabsContent>

          <TabsContent value="predict" className="mt-4 space-y-4">
            <PredictiveAnalytics f={forecast} />
            <SustainabilityPanel esg={esg} savingsPct={result.savingsPct} />
          </TabsContent>

          <TabsContent value="occupancy" className="mt-4">
            <OccupancyHeatmap data={occupancy} />
          </TabsContent>

          <TabsContent value="anomaly" className="mt-4 space-y-4">
            <AnomalyFeed items={anomalies} />
            <ActivityFeed events={activity.filter((a) => a.kind === "anomaly" || a.kind === "emergency")} />
          </TabsContent>

          <TabsContent value="maint" className="mt-4">
            <PredictiveMaintenance items={maint} />
          </TabsContent>

          <TabsContent value="auto" className="mt-4 space-y-4">
            <AutomationEngine actions={automations} />
            <ActivityFeed events={activity.filter((a) => a.kind === "automation")} />
          </TabsContent>

          <TabsContent value="emergency" className="mt-4">
            <EmergencyCenter events={emergencies} />
          </TabsContent>

          <TabsContent value="esg" className="mt-4">
            <SustainabilityPanel esg={esg} savingsPct={result.savingsPct} />
          </TabsContent>

          <TabsContent value="infra" className="mt-4">
            <InfrastructureGrid r={reading} />
          </TabsContent>
        </Tabs>

        <Card className="flex flex-wrap items-center justify-between gap-3 border-border/60 bg-gradient-card p-4 shadow-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gauge className="h-4 w-4 text-primary" />
            Sampling every {POLL_MS / 1000}s · Logging every {(POLL_MS * LOG_EVERY_N) / 1000}s to Lovable Cloud
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-energy" />
            {result.recommendations.length} active insights · {anomalies.length} anomalies · {automations.length} automations
          </div>
        </Card>
      </main>

      <EcoMindChat context={aiContext} />
    </div>
  );
};

export default Index;
