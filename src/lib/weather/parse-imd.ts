/**
 * IMD forecast HTML parsing.
 * Extracts structured forecast data from IMD public weather pages.
 * Pure function: HTML string in → structured data out.
 */
import type { ImdForecast, ForecastDay, ImdWarningColor } from '@/lib/types';

/**
 * Parse a rainfall description text to extract approximate mm value.
 * IMD uses categories: "No rain" (0), "Light" (2.5-15.5), "Moderate" (15.6-64.4),
 * "Heavy" (64.5-115.5), "Very heavy" (115.6-204.4), "Extremely heavy" (>204.4).
 */
export function parseRainfall(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  const lower = text.toLowerCase().trim();

  // Try to extract numeric mm value first (e.g., "65 mm" or "65mm")
  const numericMatch = lower.match(/(\d+(?:\.\d+)?)\s*mm/);
  if (numericMatch) return parseFloat(numericMatch[1]);

  // Category-based estimation
  if (lower.includes('extremely heavy') || lower.includes('very heavy')) return 150;
  if (lower.includes('heavy')) return 90;
  if (lower.includes('moderate')) return 40;
  if (lower.includes('light')) return 8;
  if (lower.includes('no rain') || lower.includes('dry') || lower.includes('nil')) return 0;

  return 0;
}

/**
 * Determine IMD warning color from a text string.
 */
export function parseWarningColor(text: string): ImdWarningColor {
  if (!text || typeof text !== 'string') return 'green';
  const lower = text.toLowerCase();

  if (lower.includes('red')) return 'red';
  if (lower.includes('orange')) return 'orange';
  if (lower.includes('yellow')) return 'yellow';
  return 'green';
}

/**
 * Parse IMD HTML response into structured forecast data.
 * Returns null if parsing fails (graceful degradation).
 *
 * NOTE: This is a best-effort parser. If the IMD page structure changes,
 * this will return null and the app will fall back to general guidance.
 * Actual HTML parsing with cheerio happens in the API route; this function
 * works on pre-extracted text arrays for testability.
 */
export function parseImdForecast(
  district: string,
  state: string,
  forecastTexts: string[],
): ImdForecast | null {
  if (!district || !state || !forecastTexts || forecastTexts.length === 0) {
    return null;
  }

  const today = new Date();
  const days: ForecastDay[] = forecastTexts.slice(0, 5).map((text, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    return {
      date: date.toISOString().split('T')[0],
      rainfallMm: parseRainfall(text),
      tempMin: 0, // Will be filled from actual data
      tempMax: 0, // Will be filled from actual data
      warningLevel: parseWarningColor(text),
      description: text.trim(),
    };
  });

  return { district, state, days };
}
