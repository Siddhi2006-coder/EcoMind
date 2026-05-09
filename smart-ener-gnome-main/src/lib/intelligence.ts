// Shared intelligence helpers for predictive analytics, anomaly detection,
// occupancy, maintenance, automation, sustainability and emergency.
import type { SensorReading } from "@/lib/simulator";
import { totalEnergy } from "@/lib/simulator";

// ───────────── Predictive Analytics ─────────────
export type Forecast = {
  nextHourKw: number;
  tomorrowKwh: number;
  peakHour: string;
  confidence: number; // 0..1
  anomalyProb: number; // 0..1
  series: { t: string; predicted: number; lower: number; upper: number }[];
};

export function forecastEnergy(history: number[], current: number): Forecast {
  const base = current || 50;
  const hours = 12;
  const series: Forecast["series"] = [];
  const now = new Date();
  for (let i = 1; i <= hours; i++) {
    const h = new Date(now.getTime() + i * 60 * 60 * 1000).getHours();
    // diurnal mall load curve: peak 13–20
    const factor = 0.55 + 0.6 * Math.exp(-Math.pow((h - 17) / 4.5, 2));
    const predicted = +(base * factor + (Math.random() - 0.5) * 4).toFixed(1);
    const band = predicted * 0.12;
    series.push({
      t: `${h.toString().padStart(2, "0")}:00`,
      predicted,
      lower: +(predicted - band).toFixed(1),
      upper: +(predicted + band).toFixed(1),
    });
  }
  const peak = series.reduce((a, b) => (b.predicted > a.predicted ? b : a));
  const tomorrow = +(series.reduce((s, p) => s + p.predicted, 0) * 2).toFixed(0);
  const variance =
    history.length > 3
      ? history.slice(-6).reduce((s, v, _, arr) => s + Math.pow(v - arr[0], 2), 0) / 6
      : 4;
  return {
    nextHourKw: series[0].predicted,
    tomorrowKwh: tomorrow,
    peakHour: peak.t,
    confidence: Math.max(0.62, Math.min(0.97, 0.92 - variance / 200)),
    anomalyProb: Math.min(0.95, variance / 50),
    series,
  };
}

// ───────────── Occupancy intelligence ─────────────
export type ZoneOccupancy = { zone: string; floor: number; density: number; trend: number };

export function zoneOccupancy(r: SensorReading): ZoneOccupancy[] {
  const base = r.parking_occupancy / 100;
  const j = () => (Math.random() - 0.5) * 18;
  return [
    { zone: "Entrance & Lobby", floor: 0, density: clamp(base * 95 + j()), trend: +1 },
    { zone: "Retail Shops", floor: 1, density: clamp(base * 80 + j()), trend: +2 },
    { zone: "Food Court", floor: 2, density: clamp(base * 110 + j()), trend: +3 },
    { zone: "Multiplex", floor: 3, density: clamp(base * 70 + j()), trend: -1 },
    { zone: "Gaming Zone", floor: 3, density: clamp(base * 60 + j()), trend: 0 },
    { zone: "Kids Play", floor: 2, density: clamp(base * 55 + j()), trend: +1 },
    { zone: "Parking", floor: -1, density: r.parking_occupancy, trend: 0 },
    { zone: "Washrooms", floor: 1, density: clamp(base * 35 + j()), trend: 0 },
  ];
}

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, +n.toFixed(0)));

// ───────────── Anomaly detection ─────────────
export type Anomaly = {
  id: string;
  zone: string;
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  value: number;
  ts: number;
};

export function detectAnomalies(r: SensorReading): Anomaly[] {
  const out: Anomaly[] = [];
  const push = (
    zone: string,
    type: string,
    severity: Anomaly["severity"],
    description: string,
    value: number,
  ) => out.push({ id: crypto.randomUUID(), zone, type, severity, description, value, ts: Date.now() });

  if (r.hvac_temp > 26)
    push("HVAC", "Overheating", "high", `Cabin temp ${r.hvac_temp.toFixed(1)}°C exceeds 26°C threshold`, r.hvac_temp);
  if (r.hvac_load > 88) push("HVAC", "Overload", "medium", "HVAC load above 88% — risk of compressor stress", r.hvac_load);
  if (r.lighting > 92 && r.parking_occupancy < 30)
    push("Lighting", "Power waste", "medium", "High brightness with low occupancy detected", r.lighting);
  if (r.lifts_load > 90) push("Lifts", "Mechanical stress", "high", "Lift load > 90% — possible motor strain", r.lifts_load);
  if (totalEnergy(r) > 250) push("Mall", "Power spike", "high", "Total load exceeds 250 kW threshold", totalEnergy(r));
  if (r.parking_occupancy > 92) push("Parking", "Overcrowding", "medium", "Parking near capacity", r.parking_occupancy);
  return out;
}

// ───────────── Predictive maintenance ─────────────
export type MaintenanceItem = {
  system: string;
  health: number; // 0..100
  failureProb: number; // 0..1
  urgency: "low" | "medium" | "high";
  note: string;
};

export function maintenance(r: SensorReading): MaintenanceItem[] {
  const items: MaintenanceItem[] = [
    {
      system: "HVAC Chiller",
      health: clamp(100 - r.hvac_load * 0.6 - (r.hvac_temp - 22) * 4),
      failureProb: Math.min(0.92, r.hvac_load / 140 + Math.max(0, r.hvac_temp - 24) / 30),
      urgency: r.hvac_load > 85 ? "high" : r.hvac_load > 65 ? "medium" : "low",
      note: "Compressor cycles trending upward",
    },
    {
      system: "Escalators",
      health: clamp(95 - (r.parking_occupancy / 100) * 25),
      failureProb: r.parking_occupancy / 200,
      urgency: r.parking_occupancy > 80 ? "medium" : "low",
      note: "Bearing wear correlates with traffic",
    },
    {
      system: "Lighting Drivers",
      health: clamp(98 - (r.lighting > 80 ? 18 : 6)),
      failureProb: r.lighting > 90 ? 0.34 : 0.08,
      urgency: r.lighting > 90 ? "medium" : "low",
      note: "Driver temperature within spec",
    },
    {
      system: "IoT Sensors",
      health: clamp(96 + (Math.random() - 0.5) * 6),
      failureProb: 0.05,
      urgency: "low",
      note: "All endpoints reporting",
    },
    {
      system: "Server Room AC",
      health: clamp(92 - Math.max(0, r.hvac_temp - 22) * 5),
      failureProb: Math.max(0, r.hvac_temp - 22) / 20,
      urgency: r.hvac_temp > 25 ? "high" : "low",
      note: "Critical infrastructure cooling",
    },
    {
      system: "Lift Motors",
      health: clamp(100 - r.lifts_load * 0.5),
      failureProb: r.lifts_load / 150,
      urgency: r.lifts_load > 80 ? "medium" : "low",
      note: "Vibration profile nominal",
    },
  ];
  return items;
}

// ───────────── Automation engine ─────────────
export type AutomationAction = {
  id: string;
  ts: number;
  action: string;
  target: string;
  status: "success" | "pending" | "failed";
  details: string;
};

export function suggestAutomations(r: SensorReading): AutomationAction[] {
  const acts: AutomationAction[] = [];
  const make = (action: string, target: string, details: string): AutomationAction => ({
    id: crypto.randomUUID(),
    ts: Date.now(),
    action,
    target,
    status: "success",
    details,
  });

  if (r.parking_occupancy < 25) acts.push(make("Dim lighting -40%", "Parking", "Low occupancy detected"));
  if (r.hvac_load > 80) acts.push(make("Reduce HVAC setpoint", "HVAC zones", "Load above threshold"));
  if (!r.shops_active) acts.push(make("Idle escalators", "Escalators", "Off-hours mode engaged"));
  if (r.lighting > 90 && r.parking_occupancy < 50)
    acts.push(make("Lighting -25%", "Common areas", "Daylight + low traffic"));
  if (r.hvac_temp > 25) acts.push(make("Boost ventilation", "Food Court", "Thermal comfort optimization"));
  return acts;
}

// ───────────── Emergency intelligence ─────────────
export type EmergencyEvent = {
  id: string;
  type: "smoke" | "fire" | "overheat" | "overcrowd" | "evacuation";
  zone: string;
  severity: "info" | "warning" | "critical";
  message: string;
  ts: number;
};

export function emergencyScan(r: SensorReading): EmergencyEvent[] {
  const out: EmergencyEvent[] = [];
  if (r.hvac_temp > 28)
    out.push({
      id: crypto.randomUUID(),
      type: "overheat",
      zone: "HVAC core",
      severity: "critical",
      message: `Critical overheat ${r.hvac_temp.toFixed(1)}°C — initiating emergency cooling`,
      ts: Date.now(),
    });
  if (r.parking_occupancy > 95)
    out.push({
      id: crypto.randomUUID(),
      type: "overcrowd",
      zone: "Parking",
      severity: "warning",
      message: "Parking near full — divert to overflow lot",
      ts: Date.now(),
    });
  // simulated smoke risk based on combined load
  if (totalEnergy(r) > 270 && r.hvac_temp > 26)
    out.push({
      id: crypto.randomUUID(),
      type: "smoke",
      zone: "Server Room",
      severity: "critical",
      message: "Elevated smoke risk — verify suppression system",
      ts: Date.now(),
    });
  return out;
}

// ───────────── Sustainability / ESG ─────────────
export type ESG = {
  co2SavedKg: number;
  treesEquivalent: number;
  renewablePct: number;
  esgScore: number;
  savingsPct: number;
};

export function sustainability(savedKw: number, ecoMode: boolean): ESG {
  const hours = 8; // assumed daily projection multiplier
  const kwh = Math.max(0, savedKw * hours);
  const co2 = +(kwh * 0.475).toFixed(1); // kg CO2 / kWh grid avg
  const trees = +(co2 / 21).toFixed(2);
  const renewable = +(28 + (ecoMode ? 14 : 0) + Math.random() * 5).toFixed(1);
  const esg = Math.min(100, +(62 + co2 / 10 + (ecoMode ? 10 : 0)).toFixed(0));
  return {
    co2SavedKg: co2,
    treesEquivalent: trees,
    renewablePct: renewable,
    esgScore: esg,
    savingsPct: 0,
  };
}

// ───────────── Activity feed ─────────────
export type ActivityEvent = {
  id: string;
  ts: number;
  kind: "optimization" | "ai" | "maintenance" | "anomaly" | "automation" | "emergency";
  title: string;
  detail: string;
};
