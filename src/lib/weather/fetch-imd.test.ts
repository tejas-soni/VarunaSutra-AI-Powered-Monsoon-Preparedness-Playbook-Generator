import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchImdForecast } from './fetch-imd';
import * as cheerio from 'cheerio';

// Mock the global fetch
const originalFetch = global.fetch;

describe('fetchImdForecast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    global.fetch = originalFetch;
  });

  it('returns null if state or district is empty', async () => {
    expect(await fetchImdForecast('', 'Mumbai')).toBeNull();
    expect(await fetchImdForecast('Maharashtra', '')).toBeNull();
  });

  it('returns null on fetch error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    
    const result = await fetchImdForecast('Maharashtra', 'Mumbai');
    expect(result).toBeNull();
  });

  it('returns null on non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false
    });
    
    const result = await fetchImdForecast('Maharashtra', 'Mumbai');
    expect(result).toBeNull();
  });

  it('returns null when table has insufficient rows (best effort parsing fails)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('<html><body><table><tr><td>Header</td></tr></table></body></html>')
    });
    
    const result = await fetchImdForecast('Maharashtra', 'Pune');
    expect(result).toBeNull();
  });
});
