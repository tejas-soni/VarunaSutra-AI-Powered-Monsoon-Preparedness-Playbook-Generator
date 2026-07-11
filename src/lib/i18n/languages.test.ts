import { describe, it, expect } from 'vitest';
import { sectionHeaders, SECTION_IDS, LANGUAGE_NAMES } from './languages';
import type { SupportedLang } from '@/lib/types';

describe('sectionHeaders', () => {
  it('returns English headers for "en"', () => {
    const headers = sectionHeaders('en');
    expect(headers['risk-profile']).toContain('Risk Profile');
  });

  it('returns Hindi headers for "hi"', () => {
    const headers = sectionHeaders('hi');
    expect(headers['risk-profile']).toContain('जोखिम');
  });

  it('falls back to English for unsupported language', () => {
    const headers = sectionHeaders('ta'); // Tamil not yet added
    expect(headers['risk-profile']).toContain('Risk Profile');
  });

  it('has all section IDs in English headers', () => {
    const headers = sectionHeaders('en');
    for (const id of SECTION_IDS) {
      expect(headers[id]).toBeDefined();
      expect(headers[id].length).toBeGreaterThan(0);
    }
  });

  it('has all section IDs in Hindi headers', () => {
    const headers = sectionHeaders('hi');
    for (const id of SECTION_IDS) {
      expect(headers[id]).toBeDefined();
      expect(headers[id].length).toBeGreaterThan(0);
    }
  });

  it('has all 10 section IDs defined', () => {
    expect(SECTION_IDS).toHaveLength(10);
  });
});

describe('LANGUAGE_NAMES', () => {
  const ALL_LANGS: SupportedLang[] = ['en', 'hi', 'mr', 'bn', 'ta', 'te', 'kn', 'ml', 'gu', 'or'];

  it('has a display name for every supported language', () => {
    for (const lang of ALL_LANGS) {
      expect(LANGUAGE_NAMES[lang]).toBeDefined();
      expect(LANGUAGE_NAMES[lang].length).toBeGreaterThan(0);
    }
  });

  it('has 10 languages total', () => {
    expect(Object.keys(LANGUAGE_NAMES)).toHaveLength(10);
  });
});
