import { test, expect } from '@playwright/test';

test('comic detail page shows Darkwing Duck #4 details', async ({ page }) => {
  await page.goto('/comics/darkwing-duck-4');
  console.log('✅ Navigated to /comics/darkwing-duck-4');

  await expect(page.getByRole('heading', { name: /darkwing duck #4/i })).toBeVisible();
  console.log('✅ Found comic title');

  await expect(
    page.getByText(/darkwing and launchpad return to the serious business of thwarting crime/i)
  ).toBeVisible();
  console.log('✅ Summary found');

  await expect(page.getByAltText(/darkwing duck #4/i)).toBeVisible();
  console.log('✅ Image found');

  const meta = page.locator(
    'div.flex.flex-wrap.gap-x-2.text-l.font-bold.text-teal-400:not(.sr-only)'
  );

  await expect(meta).toContainText(/dynamite entertainment/i);
  await expect(meta).toContainText(/limited series/i);
  await expect(meta).toContainText(/humor/i);
  await expect(meta).toContainText(/super-hero/i);
  console.log('✅ Series meta found');
});
