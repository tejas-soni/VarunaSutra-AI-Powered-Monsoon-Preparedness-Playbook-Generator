// Placeholder E2E test — will be expanded in stable-6
import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/VarunaSutra/);
});
