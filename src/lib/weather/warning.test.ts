import { describe, it, expect } from 'vitest';
import { determineWarning, warningMessage } from './warning';
import type { ImdForecast } from '@/lib/types';

const baseForecast: ImdForecast = {
  district: 'Mumbai',
  state: 'Maharashtra',
  days: [],
};

describe('determineWarning', () => {
  it('returns green for empty days', () => {
    expect(determineWarning(baseForecast)).toBe('green');
  });

  it('returns red for any red warning day', () => {
    const forecast: ImdForecast = {
      ...baseForecast,
      days: [
        { date: '2024-07-01', rainfallMm: 10, tempMin: 25, tempMax: 32, warningLevel: 'yellow', description: '' },
        { date: '2024-07-02', rainfallMm: 50, tempMin: 24, tempMax: 30, warningLevel: 'red', description: '' },
      ],
    };
    expect(determineWarning(forecast)).toBe('red');
  });

  it('returns orange for orange without red', () => {
    const forecast: ImdForecast = {
      ...baseForecast,
      days: [
        { date: '2024-07-01', rainfallMm: 10, tempMin: 25, tempMax: 32, warningLevel: 'orange', description: '' },
        { date: '2024-07-02', rainfallMm: 20, tempMin: 24, tempMax: 30, warningLevel: 'green', description: '' },
      ],
    };
    expect(determineWarning(forecast)).toBe('orange');
  });

  it('upgrades to red based on extreme rainfall', () => {
    const forecast: ImdForecast = {
      ...baseForecast,
      days: [
        { date: '2024-07-01', rainfallMm: 250, tempMin: 25, tempMax: 32, warningLevel: 'green', description: '' },
      ],
    };
    expect(determineWarning(forecast)).toBe('red');
  });

  it('upgrades to orange based on very heavy rainfall', () => {
    const forecast: ImdForecast = {
      ...baseForecast,
      days: [
        { date: '2024-07-01', rainfallMm: 120, tempMin: 25, tempMax: 32, warningLevel: 'green', description: '' },
      ],
    };
    expect(determineWarning(forecast)).toBe('orange');
  });

  it('returns green for normal rainfall and no warnings', () => {
    const forecast: ImdForecast = {
      ...baseForecast,
      days: [
        { date: '2024-07-01', rainfallMm: 10, tempMin: 25, tempMax: 32, warningLevel: 'green', description: '' },
      ],
    };
    expect(determineWarning(forecast)).toBe('green');
  });

  it('handles unknown warning colors gracefully', () => {
    const forecast: ImdForecast = {
      district: 'Mumbai',
      state: 'MH',
      days: [
        {
          date: '2023-01-01',
          rainfallMm: 0,
          tempMin: 0,
          tempMax: 0,
          warningLevel: 'unknown' as any,
          description: '',
        },
      ],
    };
    expect(determineWarning(forecast)).toBe('green');
  });

  it('upgrades warning to yellow for moderate-heavy rainfall', () => {
    const forecast: ImdForecast = {
      district: 'Mumbai',
      state: 'MH',
      days: [
        {
          date: '2023-01-01',
          rainfallMm: 70, // >= 64.5
          tempMin: 0,
          tempMax: 0,
          warningLevel: 'green',
          description: '',
        },
      ],
    };
    expect(determineWarning(forecast)).toBe('yellow');
  });
});

describe('warningMessage', () => {
  it('returns English message for green', () => {
    const msg = warningMessage('green', 'en');
    expect(msg).toContain('No significant');
  });

  it('returns Hindi message for red', () => {
    const msg = warningMessage('red', 'hi');
    expect(msg).toContain('लाल');
  });

  it('falls back to English for unsupported language', () => {
    const msg = warningMessage('yellow', 'ta');
    expect(msg).toContain('Yellow Alert');
  });

  it('contains emoji indicators', () => {
    expect(warningMessage('yellow', 'en')).toContain('🟡');
    expect(warningMessage('orange', 'en')).toContain('🟠');
    expect(warningMessage('red', 'en')).toContain('🔴');
  });
});
