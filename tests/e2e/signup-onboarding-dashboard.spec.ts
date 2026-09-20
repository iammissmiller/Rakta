import { test, expect } from "@playwright/test";

// A fresh random email/name each run, so this test never collides with a
// real account or a previous test run in the dev database.
const runId = Date.now();
const email = `e2e-test-${runId}@rakta-test.local`;
const password = "TestPassword123";
const name = `E2E Tester ${runId}`;

test("signup → onboarding → dashboard, end to end", async ({ page }) => {
  // --- Signup ---
  await page.goto("/login");
  await page.getByText("New here? Create an account").click();

  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Sign up →" }).click();

  // A successful signup lands on onboarding for a brand-new account.
  await page.waitForURL(/\/onboarding/, { timeout: 15_000 });

  // --- Onboarding: name ---
  await page.getByPlaceholder("Enter your name...").fill(name);
  await page.getByRole("button", { name: "Continue →" }).click();

  // --- Onboarding: who are you (auto-advances ~280ms after selection) ---
  await page.getByText("Young Woman", { exact: true }).click();
  await page.waitForTimeout(400);

  // --- Onboarding: PCOS/PMOS status (auto-advances) ---
  await page.getByText("No", { exact: true }).click();
  await page.waitForTimeout(400);

  // --- Onboarding: last period date ---
  const twentyDaysAgo = new Date();
  twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
  const dateStr = twentyDaysAgo.toISOString().split("T")[0];
  await page.locator('input[type="date"]').fill(dateStr);
  await page.getByRole("button", { name: "Continue →" }).click();

  // A successful save redirects to the welcome screen.
  await page.waitForURL(/\/welcome/, { timeout: 15_000 });
  await expect(page.getByText("Your space is ready.")).toBeVisible();

  // Welcome advances to the dashboard on click anywhere on the page.
  await page.getByText("Your space is ready.").click();
  await page.waitForURL(/\/dashboard/, { timeout: 15_000 });

  // --- Dashboard: confirms the profile actually saved and loaded back ---
  await expect(page.getByText(new RegExp(name))).toBeVisible({ timeout: 15_000 });
});