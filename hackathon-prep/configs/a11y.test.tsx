// Copy into src/__tests__/a11y.test.tsx — unit-level accessibility gate.
// Requires: npm i -D vitest-axe
// In src/test/setup.ts add:  import 'vitest-axe/extend-expect';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';

// Replace with your real component(s)
function Example() {
  return (
    <main>
      <h1>Title</h1>
      <label htmlFor="name">Name</label>
      <input id="name" />
      <button type="submit">Submit</button>
    </main>
  );
}

describe('accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Example />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

