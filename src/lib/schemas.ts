/**
 * Input validation schemas for VarunaSutra.
 * Pure validation functions — no external dependencies at scaffold time.
 * Will be upgraded to Zod schemas when the dependency is added.
 */
import type { FamilyMember, LocationInfo, Preferences, PlaybookInput } from '@/lib/types';

const VALID_GENDERS = ['male', 'female', 'other'] as const;
const VALID_HOUSING = ['apartment', 'independent', 'slum', 'kutcha', 'other'] as const;
const VALID_FLOORS = ['ground', 'above'] as const;
const VALID_WATER = ['river', 'lake', 'sea', 'nullah', 'none'] as const;
const VALID_EXPERIENCE = ['none', 'mild', 'moderate', 'severe'] as const;
const VALID_LANGUAGES = ['en', 'hi', 'mr', 'bn', 'ta', 'te', 'kn', 'ml', 'gu', 'or'] as const;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate a 6-digit Indian pincode.
 */
export function validatePincode(pincode: string): boolean {
  return /^[1-9]\d{5}$/.test(pincode);
}

/**
 * Validate a family member object.
 */
export function validateFamilyMember(member: Partial<FamilyMember>): ValidationResult {
  const errors: string[] = [];

  if (!member.name || member.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (member.age === undefined || member.age === null || member.age < 0 || member.age > 120) {
    errors.push('Age must be between 0 and 120');
  }

  if (!member.gender || !VALID_GENDERS.includes(member.gender as typeof VALID_GENDERS[number])) {
    errors.push('Gender must be male, female, or other');
  }

  if (!member.relationship || member.relationship.trim().length === 0) {
    errors.push('Relationship is required');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate location info.
 */
export function validateLocation(location: Partial<LocationInfo>): ValidationResult {
  const errors: string[] = [];

  if (!location.state || location.state.trim().length === 0) {
    errors.push('State is required');
  }

  if (!location.district || location.district.trim().length === 0) {
    errors.push('District is required');
  }

  if (!location.city || location.city.trim().length === 0) {
    errors.push('City is required');
  }

  if (!location.pincode || !validatePincode(location.pincode)) {
    errors.push('Valid 6-digit pincode is required');
  }

  if (
    !location.housingType ||
    !VALID_HOUSING.includes(location.housingType as typeof VALID_HOUSING[number])
  ) {
    errors.push('Valid housing type is required');
  }

  if (
    !location.floorLevel ||
    !VALID_FLOORS.includes(location.floorLevel as typeof VALID_FLOORS[number])
  ) {
    errors.push('Floor level is required');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate preferences.
 */
export function validatePreferences(prefs: Partial<Preferences>): ValidationResult {
  const errors: string[] = [];

  if (
    !prefs.language ||
    !VALID_LANGUAGES.includes(prefs.language as typeof VALID_LANGUAGES[number])
  ) {
    errors.push('Valid language is required');
  }

  if (prefs.budget !== undefined && (prefs.budget < 0 || prefs.budget > 100000)) {
    errors.push('Budget must be between 0 and 100000');
  }

  if (
    prefs.floodExperience &&
    !VALID_EXPERIENCE.includes(prefs.floodExperience as typeof VALID_EXPERIENCE[number])
  ) {
    errors.push('Valid flood experience level is required');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate complete playbook input.
 */
export function validatePlaybookInput(input: Partial<PlaybookInput>): ValidationResult {
  const errors: string[] = [];

  if (!input.familyMembers || input.familyMembers.length === 0) {
    errors.push('At least one family member is required');
  } else if (input.familyMembers.length > 15) {
    errors.push('Maximum 15 family members allowed');
  } else {
    for (const [i, member] of input.familyMembers.entries()) {
      const result = validateFamilyMember(member);
      if (!result.valid) {
        errors.push(...result.errors.map((e) => `Member ${i + 1}: ${e}`));
      }
    }
  }

  if (input.location) {
    const locResult = validateLocation(input.location);
    if (!locResult.valid) {
      errors.push(...locResult.errors);
    }
  } else {
    errors.push('Location is required');
  }

  if (input.preferences) {
    const prefResult = validatePreferences(input.preferences);
    if (!prefResult.valid) {
      errors.push(...prefResult.errors);
    }
  } else {
    errors.push('Preferences are required');
  }

  return { valid: errors.length === 0, errors };
}
