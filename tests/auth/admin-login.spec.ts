import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { loginAsAdmin } from "../helpers/auth";

test("server-rendered login form cannot leak credentials through a GET", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/login");

  const form = page.locator("form");
  await expect(form).toHaveAttribute("method", "post");
  await expect(form).toHaveAttribute("action", "/api/auth/noop");
  await expect(page.getByRole("button", { name: "Sign In" })).toBeDisabled();
  expect(page.url()).not.toContain("email=");
  expect(page.url()).not.toContain("password=");
  await context.close();
});

test("admin login redirects to the dashboard", async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole("heading", { name: "Agency dashboard" })).toBeVisible();
});

test("wrong password returns a plain English error", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill("emdadul.hoque@kravex.co.uk");
  await page.getByPlaceholder("Password").fill("DefinitelyWrong123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByText("Invalid email or password")).toBeVisible({ timeout: 8_000 });
});

test("every admin page loads inside the authenticated portal", async ({ page }) => {
  await loginAsAdmin(page);
  await mkdir("audit/fix-evidence/admin", { recursive: true });

  for (const route of [
    "/admin/dashboard",
    "/admin/prospects",
    "/admin/clients",
    "/admin/leads",
    "/admin/campaigns",
    "/admin/invoices",
    "/admin/invoices/new",
    "/admin/payments",
    "/admin/reports",
    "/admin/security",
    "/admin/settings",
  ]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page).toHaveURL(new RegExp(`${route.replaceAll("/", "\\/")}$`));
    await page.screenshot({
      path: `audit/fix-evidence/admin/${route.split("/").pop() || "dashboard"}.png`,
      fullPage: false,
    });
  }
});
