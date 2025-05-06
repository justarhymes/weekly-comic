import { test, expect } from '@playwright/test';

test('comic detail page shows creators for Borderlands: Moxxi\'s Mysterious Memento #4', async ({ page }) => {
  await page.goto('/comics/borderlands-moxxi-s-mysterious-memento-4');
  console.log('✅ Navigated to Borderlands comic');

  // Title check
  await expect(
    page.getByRole('heading', { name: /borderlands: moxxi.*#4/i })
  ).toBeVisible();
  
  console.log('✅ Found comic title');

  // Creators block: check a few diverse examples
  await expect(page.getByText(/writer/i)).toBeVisible();
  await expect(page.getByText(/amy chu/i)).toBeVisible();

  await expect(page.getByText(/colorist/i)).toBeVisible();
  await expect(page.getByText(/heather breckel/i)).toBeVisible();

  await expect(page.getByText(/designer/i)).toBeVisible();
  await expect(page.getByText(/kristofer mcrae/i)).toBeVisible();

  await expect(page.getByText(/letterer/i)).toBeVisible();
  await expect(page.getByText(/andworld design/i)).toBeVisible();

  await expect(page.getByText(/publisher/i)).toBeVisible();
  await expect(page.getByText(/mike richardson/i)).toBeVisible();

  console.log('✅ All checked creators and roles are visible');
});
