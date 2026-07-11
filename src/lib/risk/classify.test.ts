import { describe, it, expect } from 'vitest';
import { classifyRisk, imdColorToRisk } from './classify';

describe('classifyRisk', () => {
  it('classifies 0 as low', () => {
    expect(classifyRisk(0)).toBe('low');
  });

  it('classifies 25 as low (boundary)', () => {
    expect(classifyRisk(25)).toBe('low');
  });

  it('classifies 26 as moderate (just above low boundary)', () => {
    expect(classifyRisk(26)).toBe('moderate');
  });

  it('classifies 50 as moderate (boundary)', () => {
    expect(classifyRisk(50)).toBe('moderate');
  });

  it('classifies 51 as high (just above moderate boundary)', () => {
    expect(classifyRisk(51)).toBe('high');
  });

  it('classifies 75 as high (boundary)', () => {
    expect(classifyRisk(75)).toBe('high');
  });

  it('classifies 76 as severe (just above high boundary)', () => {
    expect(classifyRisk(76)).toBe('severe');
  });

  it('classifies 100 as severe', () => {
    expect(classifyRisk(100)).toBe('severe');
  });

  it('clamps negative to low', () => {
    expect(classifyRisk(-10)).toBe('low');
  });

  it('clamps above 100 to severe', () => {
    expect(classifyRisk(150)).toBe('severe');
  });
});

describe('imdColorToRisk', () => {
  it('maps green to low', () => {
    expect(imdColorToRisk('green')).toBe('low');
  });

  it('maps yellow to moderate', () => {
    expect(imdColorToRisk('yellow')).toBe('moderate');
  });

  it('maps orange to high', () => {
    expect(imdColorToRisk('orange')).toBe('high');
  });

  it('maps red to severe', () => {
    expect(imdColorToRisk('red')).toBe('severe');
  });
});
