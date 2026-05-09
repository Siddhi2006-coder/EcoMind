// Rule-based optimization engine — returns optimized values + recommendations.

import { SensorReading, totalEnergy, WEIGHTS } from "./simulator";

export type Severity = "info" | "warning" | "critical" | "success";

export interface Recommendation {
  id: string;
  message: string;
  severity: Severity;
  zone: "Lighting" | "HVAC" | "Parking" | "Shops" | "Overall";
}

export interface OptimizationResult {
  before: number;
  after: number;
  savingsPct: number;
  optimized: SensorReading;
  recommendations: Recommendation[];
  status: "optimal" | "warning" | "critical";
}

export function optimize(
  reading: SensorReading,
  ecoMode = false,
): OptimizationResult {
  const recs: Recommendation[] = [];
  const opt: SensorReading = { ...reading };
  const hour = new Date().getHours();
  const isNight = hour >= 22 || hour < 6;

  // Rule 1: empty parking → cut lighting
  if (reading.parking_occupancy < 10 && reading.lighting > 40) {
    opt.lighting = reading.lighting * 0.5;
    recs.push({
      id: "r1",
      zone: "Parking",
      severity: "warning",
      message: "Parking is empty but lights are ON — reduce parking lighting by 50%.",
    });
  }

  // Rule 2: HVAC high load with comfortable temp
  if (reading.hvac_load > 70 && reading.hvac_temp >= 22 && reading.hvac_temp <= 26) {
    opt.hvac_load = reading.hvac_load * 0.8;
    recs.push({
      id: "r2",
      zone: "HVAC",
      severity: "warning",
      message: "HVAC load high while temperature is stable — reduce load by 20%.",
    });
  }

  // Rule 3: HVAC overload
  if (reading.hvac_load > 90) {
    recs.push({
      id: "r3",
      zone: "HVAC",
      severity: "critical",
      message: "HVAC overload detected — immediate maintenance check recommended.",
    });
  }

  // Rule 4: shops inactive but consuming
  if (!reading.shops_active) {
    recs.push({
      id: "r4",
      zone: "Shops",
      severity: "info",
      message: "Shops inactive — schedule non-essential power shutdown.",
    });
  }

  // Rule 5: high lighting at night
  if (isNight && reading.lighting > 50) {
    opt.lighting = Math.min(opt.lighting, 35);
    recs.push({
      id: "r5",
      zone: "Lighting",
      severity: "warning",
      message: "High lighting at night — dim to 35% brightness.",
    });
  }

  // Rule 6: eco mode
  if (ecoMode) {
    opt.lighting *= 0.85;
    opt.hvac_load *= 0.9;
    recs.push({
      id: "r6",
      zone: "Overall",
      severity: "success",
      message: "Eco Mode active — lighting -15% / HVAC -10%.",
    });
  }

  const before = totalEnergy(reading);
  const after = totalEnergy(opt);
  const savingsPct = before > 0 ? +(((before - after) / before) * 100).toFixed(1) : 0;

  // Rule 7: heavy total load
  if (before > 90) {
    recs.push({
      id: "r7",
      zone: "Overall",
      severity: "critical",
      message: "Total energy load is very high — switch to Eco Mode.",
    });
  }

  if (recs.length === 0) {
    recs.push({
      id: "ok",
      zone: "Overall",
      severity: "success",
      message: "All systems operating efficiently — no action required.",
    });
  }

  const status: OptimizationResult["status"] = recs.some((r) => r.severity === "critical")
    ? "critical"
    : recs.some((r) => r.severity === "warning")
      ? "warning"
      : "optimal";

  return { before, after, savingsPct, optimized: opt, recommendations: recs, status };
}

export { WEIGHTS };
