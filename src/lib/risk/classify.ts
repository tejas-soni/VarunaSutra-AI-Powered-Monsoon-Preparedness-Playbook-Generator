/**
 * Risk classification engine.
 * Maps numeric scores to named risk levels and IMD colors to risk levels.
 */
import type { RiskLevel, ImdWarningColor } from '@/lib/types';

/** Threshold boundaries for risk classification */
const THRESHOLDS = {
  low: 25,
  moderate: 50,
  high: 75,
} as const;

/**
 * Classify a numeric risk score (0–100) into a named risk level.
 * - 0–25: low
 * - 26–50: moderate
 * - 51–75: high
 * - 76–100: severe
 */
export function classifyRisk(score: number): RiskLevel {
  const clamped = Math.max(0, Math.min(100, score));
  if (clamped <= THRESHOLDS.low) return 'low';
  if (clamped <= THRESHOLDS.moderate) return 'moderate';
  if (clamped <= THRESHOLDS.high) return 'high';
  return 'severe';
}

/**
 * Map an IMD warning color code to a risk level.
 */
export function imdColorToRisk(color: ImdWarningColor): RiskLevel {
  const map: Record<ImdWarningColor, RiskLevel> = {
    green: 'low',
    yellow: 'moderate',
    orange: 'high',
    red: 'severe',
  };
  return map[color];
}
