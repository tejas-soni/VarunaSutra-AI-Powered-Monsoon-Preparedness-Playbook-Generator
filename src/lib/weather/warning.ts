/**
 * IMD warning level assessment and message generation.
 */
import type { ImdForecast, ImdWarningColor, SupportedLang } from '@/lib/types';

/**
 * Determine the highest warning color from a forecast.
 * Takes the maximum warning across all forecast days.
 */
export function determineWarning(forecast: ImdForecast): ImdWarningColor {
  const colorPriority: Record<ImdWarningColor, number> = {
    green: 0,
    yellow: 1,
    orange: 2,
    red: 3,
  };

  const priorityToColor: ImdWarningColor[] = ['green', 'yellow', 'orange', 'red'];

  if (!forecast.days || forecast.days.length === 0) return 'green';

  let maxPriority = 0;
  for (const day of forecast.days) {
    const p = colorPriority[day.warningLevel] ?? 0;
    if (p > maxPriority) maxPriority = p;
  }

  // Also check rainfall amounts
  const maxRainfall = Math.max(...forecast.days.map((d) => d.rainfallMm));
  if (maxRainfall >= 204.5) maxPriority = Math.max(maxPriority, 3); // red
  else if (maxRainfall >= 115.6) maxPriority = Math.max(maxPriority, 2); // orange
  else if (maxRainfall >= 64.5) maxPriority = Math.max(maxPriority, 1); // yellow

  return priorityToColor[Math.min(maxPriority, 3)];
}

/** Warning messages by color and language */
const WARNING_MESSAGES: Record<ImdWarningColor, Record<string, string>> = {
  green: {
    en: 'No significant weather warning. Normal monsoon conditions expected.',
    hi: 'कोई महत्वपूर्ण मौसम चेतावनी नहीं। सामान्य मानसून की स्थिति अपेक्षित है।',
  },
  yellow: {
    en: '🟡 Yellow Alert — Be updated. Severely bad weather possible over next few days.',
    hi: '🟡 पीली चेतावनी — अपडेट रहें। अगले कुछ दिनों में गंभीर खराब मौसम संभव है।',
  },
  orange: {
    en: '🟠 Orange Alert — Be prepared. Very bad weather expected, potential to disrupt daily activities.',
    hi: '🟠 नारंगी चेतावनी — तैयार रहें। बहुत खराब मौसम की उम्मीद, दैनिक गतिविधियों में बाधा संभव।',
  },
  red: {
    en: '🔴 Red Alert — Take action! Extremely bad weather expected. Serious risk to life and property.',
    hi: '🔴 लाल चेतावनी — कार्रवाई करें! अत्यंत खराब मौसम की उम्मीद। जीवन और संपत्ति को गंभीर खतरा।',
  },
};

/**
 * Get a human-readable warning message for a given color and language.
 * Falls back to English if the language is not available.
 */
export function warningMessage(color: ImdWarningColor, lang: SupportedLang): string {
  const messages = WARNING_MESSAGES[color];
  return messages[lang] ?? messages['en'];
}
