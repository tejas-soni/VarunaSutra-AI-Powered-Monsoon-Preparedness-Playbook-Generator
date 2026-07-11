// Copy to e2e/app.spec.ts — happy-path journey + WCAG accessibility scan (0 violations).
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('user can complete the core journey', async ({ page }) => {
  await page.goto('/');
  // Use role/name locators (resilient + double as a11y checks)
  await page.getByRole('button', { name: /start|begin|enter/i }).click();
  // ...drive through the flow...
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

