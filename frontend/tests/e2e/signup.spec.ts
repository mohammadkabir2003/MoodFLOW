import { test, expect } from '@playwright/test';

test('Signup page shows error on mismatched passwords', async ({ page }) => {
  await page.goto('/signup');

  await page.getByPlaceholder('Email address').fill('testuser@example.com');
  
  const passwordInputs = await page.getByPlaceholder('Password').all();
  await passwordInputs[0].fill('password123'); 
  await passwordInputs[1].fill('password456'); 

  await page.getByRole('button', { name: "Sign Up", exact: true }).click();

  await expect(page.getByText('Passwords must match.')).toBeVisible();

  expect(page.url()).toContain('/signup');
});
