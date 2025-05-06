import { test, expect } from '@playwright/test';

test('homepage has title and navigates to comics list', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page).toHaveTitle(/Weekly Comics/i);

  const comicLinks = await page.locator('a[href^="/comics/"]').first();
  await expect(comicLinks).toBeVisible();
});
