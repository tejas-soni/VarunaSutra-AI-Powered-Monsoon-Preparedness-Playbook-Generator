/**
 * In-memory sliding-window rate limiter for Gemini API.
 * Enforces per-minute and per-day limits.
 * Pure factory function — no external dependencies.
 */
import type { RateLimiter } from '@/lib/types';

/**
 * Create an in-memory rate limiter with sliding-window counters.
 * @param rpm - Requests per minute limit (e.g., 15 for Gemini free tier)
 * @param rpd - Requests per day limit (e.g., 1500 for Gemini free tier)
 */
export function createRateLimiter(rpm: number, rpd: number): RateLimiter {
  const minuteWindow: number[] = []; // timestamps of requests in last minute
  const dayWindow: number[] = []; // timestamps of requests in last 24h

  const MINUTE_MS = 60 * 1000;
  const DAY_MS = 24 * 60 * 60 * 1000;

  function pruneWindow(window: number[], maxAge: number, now: number): void {
    while (window.length > 0 && now - window[0] > maxAge) {
      window.shift();
    }
  }

  function tryAcquire(): boolean {
    const now = Date.now();

    pruneWindow(minuteWindow, MINUTE_MS, now);
    pruneWindow(dayWindow, DAY_MS, now);

    if (minuteWindow.length >= rpm || dayWindow.length >= rpd) {
      return false;
    }

    minuteWindow.push(now);
    dayWindow.push(now);
    return true;
  }

  function remainingMinute(): number {
    const now = Date.now();
    pruneWindow(minuteWindow, MINUTE_MS, now);
    return Math.max(0, rpm - minuteWindow.length);
  }

  function remainingDay(): number {
    const now = Date.now();
    pruneWindow(dayWindow, DAY_MS, now);
    return Math.max(0, rpd - dayWindow.length);
  }

  return { tryAcquire, remainingMinute, remainingDay };
}
