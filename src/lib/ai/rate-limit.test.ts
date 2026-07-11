import { describe, it, expect } from 'vitest';
import { createRateLimiter } from './rate-limit';

describe('createRateLimiter', () => {
  it('allows requests within limit', () => {
    const limiter = createRateLimiter(3, 100);
    expect(limiter.tryAcquire()).toBe(true);
    expect(limiter.tryAcquire()).toBe(true);
    expect(limiter.tryAcquire()).toBe(true);
  });

  it('blocks requests over per-minute limit', () => {
    const limiter = createRateLimiter(2, 100);
    expect(limiter.tryAcquire()).toBe(true);
    expect(limiter.tryAcquire()).toBe(true);
    expect(limiter.tryAcquire()).toBe(false); // over limit
  });

  it('blocks requests over per-day limit', () => {
    const limiter = createRateLimiter(100, 2);
    expect(limiter.tryAcquire()).toBe(true);
    expect(limiter.tryAcquire()).toBe(true);
    expect(limiter.tryAcquire()).toBe(false); // over daily limit
  });

  it('reports remaining minute correctly', () => {
    const limiter = createRateLimiter(5, 100);
    expect(limiter.remainingMinute()).toBe(5);
    limiter.tryAcquire();
    expect(limiter.remainingMinute()).toBe(4);
    limiter.tryAcquire();
    expect(limiter.remainingMinute()).toBe(3);
  });

  it('reports remaining day correctly', () => {
    const limiter = createRateLimiter(100, 5);
    expect(limiter.remainingDay()).toBe(5);
    limiter.tryAcquire();
    expect(limiter.remainingDay()).toBe(4);
  });

  it('never returns negative remaining', () => {
    const limiter = createRateLimiter(1, 1);
    limiter.tryAcquire();
    limiter.tryAcquire(); // will be blocked but shouldn't go negative
    expect(limiter.remainingMinute()).toBeGreaterThanOrEqual(0);
    expect(limiter.remainingDay()).toBeGreaterThanOrEqual(0);
  });
});
