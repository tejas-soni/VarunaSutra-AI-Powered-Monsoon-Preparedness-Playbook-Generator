import { describe, it, expect } from 'vitest';
import { floodRiskScore, familyRiskScore } from './score';
import type { RiskInput } from '@/lib/types';

describe('floodRiskScore', () => {
  it('returns high score for ground floor + river + red warning', () => {
    const input: RiskInput = {
      housingType: 'kutcha',
      floorLevel: 'ground',
      nearbyWaterBodies: ['river'],
      rainfallMm: 200,
      warningColor: 'red',
    };
    const score = floodRiskScore(input);
    expect(score).toBeGreaterThanOrEqual(80);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('returns low score for apartment + above floor + no water + green', () => {
    const input: RiskInput = {
      housingType: 'apartment',
      floorLevel: 'above',
      nearbyWaterBodies: ['none'],
      rainfallMm: 0,
      warningColor: 'green',
    };
    const score = floodRiskScore(input);
    expect(score).toBeLessThanOrEqual(20);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('clamps to 0–100 range', () => {
    const low: RiskInput = {
      housingType: 'apartment',
      floorLevel: 'above',
      nearbyWaterBodies: [],
      rainfallMm: 0,
      warningColor: 'green',
    };
    expect(floodRiskScore(low)).toBeGreaterThanOrEqual(0);

    const high: RiskInput = {
      housingType: 'kutcha',
      floorLevel: 'ground',
      nearbyWaterBodies: ['river', 'nullah', 'sea'],
      rainfallMm: 500,
      warningColor: 'red',
    };
    expect(floodRiskScore(high)).toBeLessThanOrEqual(100);
  });

  it('increases monotonically with rainfall', () => {
    const base: RiskInput = {
      housingType: 'independent',
      floorLevel: 'ground',
      nearbyWaterBodies: ['lake'],
      rainfallMm: 0,
      warningColor: 'yellow',
    };
    const s1 = floodRiskScore({ ...base, rainfallMm: 50 });
    const s2 = floodRiskScore({ ...base, rainfallMm: 150 });
    expect(s2).toBeGreaterThanOrEqual(s1);
  });

  it('handles empty water bodies array', () => {
    const input: RiskInput = {
      housingType: 'apartment',
      floorLevel: 'above',
      nearbyWaterBodies: [],
      rainfallMm: 10,
      warningColor: 'green',
    };
    expect(floodRiskScore(input)).toBeGreaterThanOrEqual(0);
  });
});

describe('familyRiskScore', () => {
  it('combines flood and vulnerability scores', () => {
    expect(familyRiskScore(80, 60)).toBe(72); // 80*0.6 + 60*0.4 = 48+24 = 72
  });

  it('returns 0 when both inputs are 0', () => {
    expect(familyRiskScore(0, 0)).toBe(0);
  });

  it('returns 100 when both inputs are 100', () => {
    expect(familyRiskScore(100, 100)).toBe(100);
  });

  it('clamps negative inputs to 0', () => {
    expect(familyRiskScore(-10, -20)).toBe(0);
  });

  it('clamps inputs above 100', () => {
    expect(familyRiskScore(200, 200)).toBe(100);
  });
});
