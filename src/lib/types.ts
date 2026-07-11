/**
 * Core TypeScript interfaces for VarunaSutra.
 * All domain types live here — no React, no I/O.
 */

/** Supported Indian languages for playbook output */
export type SupportedLang = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te' | 'kn' | 'ml' | 'gu' | 'or';

/** Gender options for family members */
export type Gender = 'male' | 'female' | 'other';

/** Housing types common in India */
export type HousingType = 'apartment' | 'independent' | 'slum' | 'kutcha' | 'other';

/** Floor level affecting flood risk */
export type FloorLevel = 'ground' | 'above';

/** Nearby water body types */
export type WaterBody = 'river' | 'lake' | 'sea' | 'nullah' | 'none';

/** Previous monsoon experience level */
export type FloodExperience = 'none' | 'mild' | 'moderate' | 'severe';

/** IMD warning color codes */
export type ImdWarningColor = 'green' | 'yellow' | 'orange' | 'red';

/** Risk classification levels */
export type RiskLevel = 'low' | 'moderate' | 'high' | 'severe';

/** A single family member */
export interface FamilyMember {
  name: string;
  age: number;
  gender: Gender;
  relationship: string;
  medicalConditions: string[];
  medications: string[];
  allergies: string[];
  specialEquipment: string[];
  bloodGroup: string;
}

/** Location details */
export interface LocationInfo {
  state: string;
  district: string;
  city: string;
  pincode: string;
  housingType: HousingType;
  floorLevel: FloorLevel;
  nearbyWaterBodies: WaterBody[];
}

/** Preferences */
export interface Preferences {
  language: SupportedLang;
  hasPets: boolean;
  petType: string;
  petCount: number;
  floodExperience: FloodExperience;
  budget: number;
  specificConcerns: string;
}

/** Complete form input for playbook generation */
export interface PlaybookInput {
  familyMembers: FamilyMember[];
  location: LocationInfo;
  preferences: Preferences;
}

/** Risk assessment input for the scoring engine */
export interface RiskInput {
  housingType: HousingType;
  floorLevel: FloorLevel;
  nearbyWaterBodies: WaterBody[];
  rainfallMm: number;
  warningColor: ImdWarningColor;
}

/** A single day's IMD forecast */
export interface ForecastDay {
  date: string;
  rainfallMm: number;
  tempMin: number;
  tempMax: number;
  warningLevel: ImdWarningColor;
  description: string;
}

/** Parsed IMD forecast for a district */
export interface ImdForecast {
  district: string;
  state: string;
  days: ForecastDay[];
}

/** A member flagged as vulnerable */
export interface VulnerableMember {
  member: FamilyMember;
  reasons: string[];
}

/** A single section in the playbook */
export interface PlaybookSection {
  id: string;
  title: string;
  emoji: string;
  content: string;
}

/** The playbook skeleton before AI enrichment */
export interface PlaybookSkeleton {
  sections: PlaybookSection[];
  riskLevel: RiskLevel;
  language: SupportedLang;
}

/** The final playbook */
export interface Playbook {
  title: string;
  sections?: PlaybookSection[]; // Deprecated in favor of markdownContent
  markdownContent?: string;
  riskLevel: RiskLevel;
  language: SupportedLang;
  generatedAt: string;
  isAiEnriched: boolean;
}

/** Rate limiter interface */
export interface RateLimiter {
  tryAcquire: () => boolean;
  remainingMinute: () => number;
  remainingDay: () => number;
}
