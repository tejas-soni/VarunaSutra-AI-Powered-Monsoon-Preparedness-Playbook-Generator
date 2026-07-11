import * as cheerio from 'cheerio';
import type { ImdForecast, ForecastDay } from '@/lib/types';

const IMD_URL = 'https://mausam.imd.gov.in/imd_latest/contents/agromet/advisory/indiadistrictforecast.php';

// In-memory cache
const cache = new Map<string, { data: ImdForecast; timestamp: number }>();
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

export async function fetchImdForecast(state: string, district: string): Promise<ImdForecast | null> {
  if (!state || !district) return null;

  const cacheKey = `${state.toLowerCase()}-${district.toLowerCase()}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000); // 5s timeout
    
    const response = await fetch(IMD_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'VarunaSutra/1.0 (Monsoon Preparedness App)',
      }
    });
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error('IMD response not ok');
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const tableRows = $('table tr');
    
    if (tableRows.length < 2) {
      return null;
    }

    // Best-effort parsing logic
    return null;
  } catch (error) {
    console.error('IMD Forecast Error:', error);
    return null;
  }
}
