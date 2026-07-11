import { describe, it, expect } from 'vitest';
import {
  validatePincode,
  validateFamilyMember,
  validateLocation,
  validatePreferences,
  validatePlaybookInput,
} from './schemas';

describe('validatePincode', () => {
  it('accepts valid 6-digit pincodes', () => {
    expect(validatePincode('400001')).toBe(true); // Mumbai
    expect(validatePincode('110001')).toBe(true); // Delhi
  });

  it('rejects pincodes starting with 0', () => {
    expect(validatePincode('000001')).toBe(false);
    expect(validatePincode('012345')).toBe(false);
  });

  it('rejects pincodes with wrong length', () => {
    expect(validatePincode('12345')).toBe(false);
    expect(validatePincode('1234567')).toBe(false);
  });

  it('rejects non-numeric pincodes', () => {
    expect(validatePincode('abcdef')).toBe(false);
    expect(validatePincode('12345a')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validatePincode('')).toBe(false);
  });
});

describe('validateFamilyMember', () => {
  it('accepts valid member', () => {
    const result = validateFamilyMember({
      name: 'Test User',
      age: 30,
      gender: 'male',
      relationship: 'self',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects empty name', () => {
    const result = validateFamilyMember({ name: '', age: 30, gender: 'male', relationship: 'self' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Name is required');
  });

  it('rejects negative age', () => {
    const result = validateFamilyMember({
      name: 'Test',
      age: -1,
      gender: 'male',
      relationship: 'self',
    });
    expect(result.valid).toBe(false);
  });

  it('rejects age over 120', () => {
    const result = validateFamilyMember({
      name: 'Test',
      age: 121,
      gender: 'male',
      relationship: 'self',
    });
    expect(result.valid).toBe(false);
  });

  it('rejects invalid gender', () => {
    const result = validateFamilyMember({
      name: 'Test',
      age: 30,
      gender: 'invalid' as 'male',
      relationship: 'self',
    });
    expect(result.valid).toBe(false);
  });

  it('rejects empty relationship', () => {
    const result = validateFamilyMember({
      name: 'Test',
      age: 30,
      gender: 'male',
      relationship: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Relationship is required');
  });
});

describe('validateLocation', () => {
  it('accepts valid location', () => {
    const result = validateLocation({
      state: 'Maharashtra',
      district: 'Mumbai',
      city: 'Mumbai',
      pincode: '400001',
      housingType: 'apartment',
      floorLevel: 'above',
    });
    expect(result.valid).toBe(true);
  });

  it('rejects missing state', () => {
    const result = validateLocation({
      state: '',
      district: 'Mumbai',
      city: 'Mumbai',
      pincode: '400001',
      housingType: 'apartment',
      floorLevel: 'above',
    });
    expect(result.valid).toBe(false);
  });

  it('rejects invalid pincode', () => {
    const result = validateLocation({
      state: 'Maharashtra',
      district: 'Mumbai',
      city: 'Mumbai',
      pincode: '12345',
      housingType: 'apartment',
      floorLevel: 'above',
    });
    expect(result.valid).toBe(false);
  });

  it('rejects invalid housing type', () => {
    const result = validateLocation({
      state: 'Maharashtra',
      district: 'Mumbai',
      city: 'Mumbai',
      pincode: '400001',
      housingType: 'mansion' as 'apartment',
      floorLevel: 'above',
    });
    expect(result.valid).toBe(false);
  });

  it('rejects missing district', () => {
    const result = validateLocation({
      state: 'Maharashtra',
      district: '',
      city: 'Mumbai',
      pincode: '400001',
      housingType: 'apartment',
      floorLevel: 'above',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('District is required');
  });

  it('rejects missing city', () => {
    const result = validateLocation({
      state: 'Maharashtra',
      district: 'Mumbai',
      city: '',
      pincode: '400001',
      housingType: 'apartment',
      floorLevel: 'above',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('City is required');
  });

  it('rejects missing floor level', () => {
    const result = validateLocation({
      state: 'Maharashtra',
      district: 'Mumbai',
      city: 'Mumbai',
      pincode: '400001',
      housingType: 'apartment',
      floorLevel: '' as 'above',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Floor level is required');
  });
});

describe('validatePreferences', () => {
  it('accepts valid preferences', () => {
    const result = validatePreferences({ language: 'en', budget: 5000, floodExperience: 'none' });
    expect(result.valid).toBe(true);
  });

  it('rejects invalid language', () => {
    const result = validatePreferences({ language: 'fr' as 'en' });
    expect(result.valid).toBe(false);
  });

  it('rejects negative budget', () => {
    const result = validatePreferences({ language: 'en', budget: -100 });
    expect(result.valid).toBe(false);
  });

  it('rejects invalid flood experience', () => {
    const result = validatePreferences({ language: 'en', floodExperience: 'a lot' as 'none' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Valid flood experience level is required');
  });
});

describe('validatePlaybookInput', () => {
  it('rejects empty family members', () => {
    const result = validatePlaybookInput({ familyMembers: [] });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('At least one family member is required');
  });

  it('rejects more than 15 family members', () => {
    const members = Array.from({ length: 16 }, (_, i) => ({
      name: `Member ${i}`,
      age: 30,
      gender: 'male' as const,
      relationship: 'family',
      medicalConditions: [],
      medications: [],
      allergies: [],
      specialEquipment: [],
      bloodGroup: '',
    }));
    const result = validatePlaybookInput({
      familyMembers: members,
      location: {
        state: 'Maharashtra',
        district: 'Mumbai',
        city: 'Mumbai',
        pincode: '400001',
        housingType: 'apartment',
        floorLevel: 'above',
        nearbyWaterBodies: [],
      },
      preferences: {
        language: 'en',
        hasPets: false,
        petType: '',
        petCount: 0,
        floodExperience: 'none',
        budget: 5000,
        specificConcerns: '',
      },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Maximum 15 family members allowed');
  });

  it('rejects missing location', () => {
    const result = validatePlaybookInput({
      familyMembers: [
        {
          name: 'Test',
          age: 30,
          gender: 'male',
          relationship: 'self',
          medicalConditions: [],
          medications: [],
          allergies: [],
          specialEquipment: [],
          bloodGroup: '',
        },
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Location is required');
  });

  it('propagates member errors', () => {
    const result = validatePlaybookInput({
      familyMembers: [{ name: '', age: 30, gender: 'male', relationship: 'self' } as any],
      location: {
        state: 'MH',
        district: 'Mumbai',
        city: 'Mumbai',
        pincode: '400001',
        housingType: 'apartment',
        floorLevel: 'above',
      } as any,
      preferences: { language: 'en' } as any,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Member 1: Name is required');
  });

  it('propagates location errors', () => {
    const result = validatePlaybookInput({
      familyMembers: [{ name: 'Test', age: 30, gender: 'male', relationship: 'self' } as any],
      location: {
        state: '',
        district: 'Mumbai',
        city: 'Mumbai',
        pincode: '400001',
        housingType: 'apartment',
        floorLevel: 'above',
      } as any,
      preferences: { language: 'en' } as any,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('State is required');
  });

  it('propagates preference errors', () => {
    const result = validatePlaybookInput({
      familyMembers: [{ name: 'Test', age: 30, gender: 'male', relationship: 'self' } as any],
      location: {
        state: 'MH',
        district: 'Mumbai',
        city: 'Mumbai',
        pincode: '400001',
        housingType: 'apartment',
        floorLevel: 'above',
      } as any,
      preferences: { language: 'invalid' as 'en' } as any,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Valid language is required');
  });

  it('rejects missing preferences', () => {
    const result = validatePlaybookInput({
      familyMembers: [{ name: 'Test', age: 30, gender: 'male', relationship: 'self' } as any],
      location: {
        state: 'MH',
        district: 'Mumbai',
        city: 'Mumbai',
        pincode: '400001',
        housingType: 'apartment',
        floorLevel: 'above',
      } as any,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Preferences are required');
  });
});
