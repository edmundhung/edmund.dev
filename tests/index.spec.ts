import { it, expect } from './setup';

it.beforeEach(async ({ page }) => {
  await page.goto('/');
});

it('shows my name', async ({ page }) => {
  const name = page.locator('h1').getByText('Edmund Hung', {
    exact: false,
  });

  await expect(name).toBeVisible();
});
