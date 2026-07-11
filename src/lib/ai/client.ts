import { GoogleGenerativeAI } from '@google/generative-ai';
import type { PlaybookInput, Playbook } from '@/lib/types';
import { generateFallback } from './fallback';
import { createRateLimiter } from './rate-limit';
import { buildPrompt } from '../prompt-builder';

// Global rate limiter instance (15 RPM, 1500 RPD)
export const limiter = createRateLimiter(15, 1500);

/**
 * Clean user input to prevent prompt injection and clamp length.
 */
export function sanitizeInput(text: string | undefined): string {
  if (!text) return '';
  // Clamp length to 2000 chars
  let clean = text.slice(0, 2000);
  // Strip markdown fences that could break prompt structure
  clean = clean.replace(/```/g, '');
  return clean;
}

/**
 * Generate a playbook using Gemini 2.5 Flash.
 * Falls back to local template if API key is missing, network fails, or rate-limited.
 */
export async function generatePlaybookAi(input: PlaybookInput, forecast: any = null): Promise<Playbook> {
  const apiKey = process.env.GEMINI_API_KEY;

  // 1. Fallback if no API key
  if (!apiKey) {
    return generateFallback(input);
  }

  // 2. Fallback if rate limited
  if (!limiter.tryAcquire()) {
    return generateFallback(input);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: buildPrompt(input, forecast).systemInstruction,
    });

    const prompt = buildPrompt(input, forecast).userPrompt;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Merge with fallback skeleton (just taking the fallback base and swapping content)
    const base = generateFallback(input);
    return {
      ...base,
      markdownContent: text,
      isAiEnriched: true,
    };
  } catch (error) {
    // 3. Fallback if network or parsing fails
    console.error('Gemini generation failed, using local fallback:', error);
    return generateFallback(input);
  }
}
