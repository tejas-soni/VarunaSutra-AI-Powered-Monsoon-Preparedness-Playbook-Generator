import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generatePlaybookAi, sanitizeInput, limiter } from './client';
import type { PlaybookInput } from '@/lib/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const generateContentMock = vi.fn().mockResolvedValue({
  response: {
    text: () => 'Fake Markdown Output'
  }
});

// Mock the GoogleGenerativeAI module
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: generateContentMock
        };
      }
    }
  };
});

describe('AI Client & Fallback', () => {
  const dummyInput: PlaybookInput = {
    familyMembers: [],
    location: {
      state: 'MH', district: 'Mumbai', city: 'Mumbai', pincode: '400001',
      housingType: 'apartment', floorLevel: 'above', nearbyWaterBodies: []
    },
    preferences: {
      language: 'en', hasPets: false, petType: '', petCount: 0,
      floodExperience: 'none', budget: 1000, specificConcerns: 'Power cuts ```malicious code```'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'dummy-key';
  });

  it('sanitizes input and strips markdown fences', () => {
    const clean = sanitizeInput(dummyInput.preferences.specificConcerns);
    expect(clean).not.toContain('```');
    expect(clean).toContain('Power cuts malicious code');
  });

  it('uses fallback if API key is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    const result = await generatePlaybookAi(dummyInput);
    expect(result.isAiEnriched).toBe(false);
    expect(result.markdownContent).toContain('Risk Profile');
  });

  it('uses fallback if rate limited', async () => {
    vi.spyOn(limiter, 'tryAcquire').mockReturnValueOnce(false);
    
    const result = await generatePlaybookAi(dummyInput);
    expect(result.isAiEnriched).toBe(false);
    expect(result.markdownContent).toContain('Risk Profile');
  });
  
  it('uses fallback if network fails', async () => {
    generateContentMock.mockRejectedValueOnce(new Error('Network Error'));

    const result = await generatePlaybookAi(dummyInput);
    expect(result.isAiEnriched).toBe(false);
    expect(result.markdownContent).toContain('Risk Profile');
  });

  it('uses AI when key is present and network succeeds', async () => {
    vi.spyOn(limiter, 'tryAcquire').mockReturnValueOnce(true);
    const result = await generatePlaybookAi(dummyInput);
    expect(result.isAiEnriched).toBe(true);
    expect(result.markdownContent).toBe('Fake Markdown Output');
  });
});
