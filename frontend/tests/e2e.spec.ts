import { test, expect } from "@playwright/test";

test("user can navigate from home page to login page", async ({ page }) => {
  await page.goto("/");

  // Click the Sign In button in navbar
  await page.getByRole("link", { name: "Sign In" }).click();

  // Verify we are on the login page
  await expect(page).toHaveURL(/.*login/);

  // Verify login form is visible
  await expect(page.getByText("Sign in to your account")).toBeVisible();
});
