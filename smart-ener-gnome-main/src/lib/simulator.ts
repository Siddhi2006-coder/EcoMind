// IoT sensor simulator — generates realistic mall energy readings.

export interface SensorReading {
  timestamp: string;
  lighting: number;          // 0-100 % usage
  hvac_temp: number;         // 18-35 °C
  hvac_load: number;         // 0-100 %
  parking_occupancy: number; // 0-100 %
  shops_active: boolean;
  lifts_load: number;        // base load 10-25
}

let prev: SensorReading | null = null;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function drift(value: number, amount: number, min: number, max: number) {
  return clamp(value + (Math.random() - 0.5) * amount, min, max);
}

export function generateReading(): SensorReading {
  const hour = new Date().getHours();
  const isOpen = hour >= 9 && hour <= 22;
  const isPeak = hour >= 17 && hour <= 21;

  if (!prev) {
    prev = {
      timestamp: new Date().toISOString(),
      lighting: isOpen ? 70 : 25,
      hvac_temp: 24,
      hvac_load: isOpen ? 60 : 20,
      parking_occupancy: isOpen ? 50 : 10,
      shops_active: isOpen,
      lifts_load: isOpen ? 18 : 10,
    };
    return prev;
  }

  const baseLighting = isOpen ? (isPeak ? 85 : 70) : 25;
  const baseHvac = isOpen ? (isPeak ? 75 : 55) : 20;
  const baseParking = isOpen ? (isPeak ? 75 : 45) : 8;

  prev = {
    timestamp: new Date().toISOString(),
    lighting: drift(prev.lighting * 0.7 + baseLighting * 0.3, 8, 0, 100),
    hvac_temp: drift(prev.hvac_temp, 0.6, 18, 35),
    hvac_load: drift(prev.hvac_load * 0.7 + baseHvac * 0.3, 10, 0, 100),
    parking_occupancy: drift(prev.parking_occupancy * 0.8 + baseParking * 0.2, 6, 0, 100),
    shops_active: isOpen,
    lifts_load: drift(prev.lifts_load, 2, 8, 25),
  };
  return prev;
}

export function resetSimulator() {
  prev = null;
}

// Energy weighting (kW units, illustrative)
export const WEIGHTS = {
  lighting: 1.2,
  hvac: 2.5,
  parking: 0.8,
  lifts: 1.0,
  shopsBase: 30,
};

export function totalEnergy(r: SensorReading): number {
  const shops = r.shops_active ? WEIGHTS.shopsBase : 5;
  return +(
    (r.lighting * WEIGHTS.lighting) / 10 +
    (r.hvac_load * WEIGHTS.hvac) / 10 +
    (r.parking_occupancy * WEIGHTS.parking) / 10 +
    r.lifts_load * WEIGHTS.lifts / 10 +
    shops
  ).toFixed(2);
}
