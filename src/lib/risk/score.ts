/**
 * Flood risk scoring engine.
 * Pure function: same input → same output, no I/O.
 */
import type { RiskInput } from '@/lib/types';

/** Weight factors for risk calculation */
const HOUSING_WEIGHT: Record<string, number> = {
  kutcha: 30,
  slum: 25,
  independent: 15,
  apartment: 10,
  other: 20,
};

const FLOOR_WEIGHT: Record<string, number> = {
  ground: 20,
  above: 5,
};

const WATER_BODY_WEIGHT: Record<string, number> = {
  river: 15,
  nullah: 12,
  sea: 10,
  lake: 8,
  none: 0,
};

const WARNING_WEIGHT: Record<string, number> = {
  red: 20,
  orange: 15,
  yellow: 8,
  green: 0,
};

/**
 * Calculate flood risk score (0–100) from location + housing factors.
 * Higher score = higher risk.
 */
export function floodRiskScore(input: RiskInput): number {
  const housing = HOUSING_WEIGHT[input.housingType] ?? 15;
  const floor = FLOOR_WEIGHT[input.floorLevel] ?? 10;

  // Take the highest water body risk
  const waterRisk = input.nearbyWaterBodies.length === 0
    ? 0
    : Math.max(...input.nearbyWaterBodies.map((wb) => WATER_BODY_WEIGHT[wb] ?? 0));

  const warning = WARNING_WEIGHT[input.warningColor] ?? 0;

  // Rainfall contributes up to 15 points (scaled from 0–200mm range)
  const rainfallContribution = Math.min(15, (input.rainfallMm / 200) * 15);

  const raw = housing + floor + waterRisk + warning + rainfallContribution;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

/**
 * Combine flood risk and family vulnerability into an overall score (0–100).
 * Weighted average: 60% flood risk + 40% vulnerability.
 */
export function familyRiskScore(flood: number, vulnerability: number): number {
  const clampedFlood = Math.max(0, Math.min(100, flood));
  const clampedVuln = Math.max(0, Math.min(100, vulnerability));
  return Math.round(clampedFlood * 0.6 + clampedVuln * 0.4);
}
