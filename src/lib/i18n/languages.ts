/**
 * Internationalization — section headers and labels in supported languages.
 * Pure data + lookup functions, no external dependencies.
 */
import type { SupportedLang } from '@/lib/types';

/** Section IDs used throughout the playbook */
export const SECTION_IDS = [
  'risk-profile',
  'timeline',
  'family-safety',
  'emergency-checklist',
  'evacuation',
  'stockpile',
  'travel-advisory',
  'home-protection',
  'emergency-contacts',
  'during-after',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Section headers in English (default) */
const EN_HEADERS: Record<SectionId, string> = {
  'risk-profile': '🏠 Your Monsoon Risk Profile',
  'timeline': '⏰ Preparation Timeline',
  'family-safety': '👨‍👩‍👧‍👦 Family-Specific Safety Plan',
  'emergency-checklist': '📋 Emergency Checklist',
  'evacuation': '🏃 Evacuation Plan',
  'stockpile': '🍚 Food & Water Stockpile',
  'travel-advisory': '🚗 Travel Advisory',
  'home-protection': '🏠 Home Protection Guide',
  'emergency-contacts': '📞 Emergency Contacts & Resources',
  'during-after': '🔄 During & After the Event',
};

/** Section headers in Hindi */
const HI_HEADERS: Record<SectionId, string> = {
  'risk-profile': '🏠 आपकी मानसून जोखिम रूपरेखा',
  'timeline': '⏰ तैयारी की समय सारिणी',
  'family-safety': '👨‍👩‍👧‍👦 परिवार-विशिष्ट सुरक्षा योजना',
  'emergency-checklist': '📋 आपातकालीन जाँच सूची',
  'evacuation': '🏃 निकासी योजना',
  'stockpile': '🍚 खाद्य एवं जल भंडार',
  'travel-advisory': '🚗 यात्रा सलाह',
  'home-protection': '🏠 घर सुरक्षा गाइड',
  'emergency-contacts': '📞 आपातकालीन संपर्क और संसाधन',
  'during-after': '🔄 घटना के दौरान और बाद में',
};

/** All language headers (extend as languages are added) */
const HEADERS: Partial<Record<SupportedLang, Record<SectionId, string>>> = {
  en: EN_HEADERS,
  hi: HI_HEADERS,
};

/**
 * Get localized section headers for a given language.
 * Falls back to English if the language is not available.
 */
export function sectionHeaders(lang: SupportedLang): Record<SectionId, string> {
  return HEADERS[lang] ?? EN_HEADERS;
}

/** Language display names */
export const LANGUAGE_NAMES: Record<SupportedLang, string> = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  mr: 'मराठी (Marathi)',
  bn: 'বাংলা (Bengali)',
  ta: 'தமிழ் (Tamil)',
  te: 'తెలుగు (Telugu)',
  kn: 'ಕನ್ನಡ (Kannada)',
  ml: 'മലയാളം (Malayalam)',
  gu: 'ગુજરાતી (Gujarati)',
  or: 'ଓଡ଼ିଆ (Odia)',
};
