import { describe, it, expect } from 'vitest';
import { buildPrompt } from './prompt-builder';
import type { PlaybookInput, ImdForecast } from '@/lib/types';

describe('buildPrompt', () => {
  const dummyInput: PlaybookInput = {
    familyMembers: [
      { name: 'John', age: 35, gender: 'male', relationship: 'Self', medicalConditions: ['Asthma'], medications: ['Inhaler'], allergies: [], specialEquipment: [], bloodGroup: 'O+' },
      { name: 'Jane', age: 30, gender: 'female', relationship: 'Spouse', medicalConditions: [], medications: [], allergies: [], specialEquipment: [], bloodGroup: 'A+' },
    ],
    location: {
      state: 'Maharashtra', district: 'Mumbai', city: 'Mumbai', pincode: '400001',
      housingType: 'apartment', floorLevel: 'ground', nearbyWaterBodies: ['sea']
    },
    preferences: {
      language: 'hi', hasPets: true, petType: 'Dog', petCount: 1,
      floodExperience: 'mild', budget: 5000, specificConcerns: 'Power cuts'
    }
  };

  const dummyForecast: ImdForecast = {
    state: 'Maharashtra',
    district: 'Mumbai',
    days: [
      { date: '2023-07-20', warningLevel: 'red', rainfallMm: 150, description: 'Heavy Rain', tempMin: 24, tempMax: 30 }
    ]
  };

  it('generates system instruction and user prompt', () => {
    const { systemInstruction, userPrompt } = buildPrompt(dummyInput, dummyForecast);
    
    expect(systemInstruction).toContain('VarunaSutra');
    
    // Check if family members are included
    expect(userPrompt).toContain('John');
    expect(userPrompt).toContain('Asthma');
    expect(userPrompt).toContain('Inhaler');
    
    // Check if location is included
    expect(userPrompt).toContain('Mumbai');
    expect(userPrompt).toContain('400001');
    expect(userPrompt).toContain('ground');
    
    // Check if preferences are included
    expect(userPrompt).toContain('Hindi'); // Language translation
    expect(userPrompt).toContain('Dog');
    expect(userPrompt).toContain('₹5000');
    expect(userPrompt).toContain('Power cuts');
    
    // Check if forecast is included
    expect(userPrompt).toContain('Heavy Rain');
    expect(userPrompt).toContain('150mm');
  });

  it('handles null forecast gracefully', () => {
    const { userPrompt } = buildPrompt(dummyInput, null);
    expect(userPrompt).toContain('No specific forecast available');
  });

  it('handles empty medical conditions and no pets', () => {
    const emptyInput: PlaybookInput = {
      ...dummyInput,
      familyMembers: [
        { name: 'John', age: 35, gender: 'male', relationship: 'Self', medicalConditions: [], medications: [], allergies: [], specialEquipment: [], bloodGroup: 'O+' },
      ],
      preferences: {
        ...dummyInput.preferences,
        hasPets: false,
        budget: 0
      }
    };

    const { userPrompt } = buildPrompt(emptyInput, null);
    expect(userPrompt).toContain('None'); // For medical conditions
    expect(userPrompt).toContain('Not specified'); // For budget
  });
});
