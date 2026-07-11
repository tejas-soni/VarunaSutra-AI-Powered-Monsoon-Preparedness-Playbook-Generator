import { describe, it, expect } from 'vitest';
import { parseRainfall, parseWarningColor, parseImdForecast } from './parse-imd';

describe('parseRainfall', () => {
  it('extracts numeric mm value', () => {
    expect(parseRainfall('65 mm rainfall expected')).toBe(65);
    expect(parseRainfall('12.5mm')).toBe(12.5);
  });

  it('maps "heavy rainfall" to ~90mm', () => {
    expect(parseRainfall('heavy rainfall')).toBe(90);
  });

  it('maps "very heavy" to ~150mm', () => {
    expect(parseRainfall('very heavy rainfall expected')).toBe(150);
  });

  it('maps "extremely heavy" to ~150mm', () => {
    expect(parseRainfall('extremely heavy')).toBe(150);
  });

  it('maps "moderate" to ~40mm', () => {
    expect(parseRainfall('moderate rain')).toBe(40);
  });

  it('maps "light" to ~8mm', () => {
    expect(parseRainfall('light rain likely')).toBe(8);
  });

  it('maps "no rain" to 0', () => {
    expect(parseRainfall('no rain')).toBe(0);
  });

  it('maps "dry" to 0', () => {
    expect(parseRainfall('dry conditions')).toBe(0);
  });

  it('returns 0 for missing or undefined text', () => {
    expect(parseRainfall('')).toBe(0);
    expect(parseRainfall(null as any)).toBe(0);
  });

  it('returns 0 for completely unrecognized text', () => {
    expect(parseRainfall('some random weather info with no keywords')).toBe(0);
  });
});

describe('parseWarningColor', () => {
  it('detects red warning', () => {
    expect(parseWarningColor('Red alert issued')).toBe('red');
  });

  it('detects orange warning', () => {
    expect(parseWarningColor('Orange warning')).toBe('orange');
  });

  it('detects yellow warning', () => {
    expect(parseWarningColor('Yellow alert')).toBe('yellow');
  });

  it('defaults to green for no warning text', () => {
    expect(parseWarningColor('Normal conditions')).toBe('green');
  });

  it('defaults to green for empty/null', () => {
    expect(parseWarningColor('')).toBe('green');
    expect(parseWarningColor(null as unknown as string)).toBe('green');
  });
});

describe('parseImdForecast', () => {
  it('returns structured forecast from valid input', () => {
    const result = parseImdForecast('Mumbai', 'Maharashtra', [
      'Heavy rainfall 65 mm',
      'Moderate rain',
      'Light rain',
    ]);
    expect(result).not.toBeNull();
    expect(result!.district).toBe('Mumbai');
    expect(result!.state).toBe('Maharashtra');
    expect(result!.days).toHaveLength(3);
    expect(result!.days[0].rainfallMm).toBe(65);
  });

  it('limits to 5 days', () => {
    const texts = Array(10).fill('Light rain');
    const result = parseImdForecast('Pune', 'Maharashtra', texts);
    expect(result!.days).toHaveLength(5);
  });

  it('returns null for empty district', () => {
    expect(parseImdForecast('', 'Maharashtra', ['rain'])).toBeNull();
  });

  it('returns null for empty state', () => {
    expect(parseImdForecast('Mumbai', '', ['rain'])).toBeNull();
  });

  it('returns null for empty forecast array', () => {
    expect(parseImdForecast('Mumbai', 'Maharashtra', [])).toBeNull();
  });

  it('returns null for null inputs', () => {
    expect(parseImdForecast(null as unknown as string, 'x', ['y'])).toBeNull();
  });
});
