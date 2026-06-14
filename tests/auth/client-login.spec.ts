import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { loginAsClient } from "../helpers/auth";

test("client login redirects to the client dashboard", async ({ page }) => {
  await loginAsClient(page);
  await expect(page.getByText("Here is your KRAVEX overview.")).toBeVisible();
});

test("every client page loads inside the authenticated portal", async ({ page }) => {
  await loginAsClient(page);
  await mkdir("audit/fix-evidence/client", { recursive: true });

  for (const route of [
    "/client/dashboard",
    "/client/leads",
    "/client/invoices",
    "/client/messages",
    "/client/account",
  ]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page).toHaveURL(new RegExp(`${route.replaceAll("/", "\\/")}$`));
    await page.screenshot({
      path: `audit/fix-evidence/client/${route.split("/").pop()}.png`,
      fullPage: false,
    });
  }
});
