import { test, expect } from '@playwright/test';

test('login page loads successfully', async ({ page }) => {
  await page.goto('/login');

  await expect(
    page.getByRole('heading', { name: /sign in to your account/i })
  ).toBeVisible();

  await expect(page.getByPlaceholder('Email address')).toBeVisible();
  await expect(page.getByPlaceholder('Password')).toBeVisible();

  await expect(
    page.getByRole('button', { name: /^sign in$/i })
  ).toBeVisible();
});