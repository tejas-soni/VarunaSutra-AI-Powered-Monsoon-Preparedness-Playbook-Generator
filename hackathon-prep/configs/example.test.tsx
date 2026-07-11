// Example test pattern — copy into src/__tests__/ and adapt.
// Shows: pure-logic test + accessible-component test (covers "test coverage" + "a11y" checks).
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// --- Pure logic test (keep logic in lib/ so it's trivial to test) ---
function add(a: number, b: number): number {
  return a + b;
}

describe('add', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
  it('handles negatives', () => {
    expect(add(-1, -1)).toBe(-2);
  });
});

// --- Accessible component test ---
function SubmitButton({ label }: { label: string }) {
  return <button type="submit">{label}</button>;
}

describe('SubmitButton', () => {
  it('renders an accessible button by role and name', () => {
    render(<SubmitButton label="Send" />);
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });
});

