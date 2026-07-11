import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility and Core Journey', () => {
  test('landing page has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('generate page has no accessibility violations', async ({ page }) => {
    await page.goto('/generate');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('user can complete the core journey from landing to generate', async ({ page }) => {
    await page.goto('/');
    
    // Verify landing page content
    await expect(page.getByRole('heading', { level: 1, name: /Monsoon Preparedness/i })).toBeVisible();

    // Click the CTA button - note the role is actually 'link' since it's a Next.js <Link> component
    // But in page.tsx I set role="button", so it should be queryable as button
    const cta = page.getByRole('button', { name: /Generate Your Playbook/i });
    await expect(cta).toBeVisible();
    await cta.click();

    // Verify navigation to generate page
    await expect(page).toHaveURL(/\/generate/);
    await expect(page.getByRole('heading', { level: 1, name: /Generate Your Playbook/i })).toBeVisible();
  });
});
