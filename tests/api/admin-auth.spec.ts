import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";

test("admin session can read protected seeded data", async ({ page }) => {
  await loginAsAdmin(page);

  for (const [route, minimum] of [
    ["/api/admin/clients", 2],
    ["/api/admin/prospects", 3],
    ["/api/admin/leads", 8],
    ["/api/admin/invoices", 2],
  ] as const) {
    const response = await page.request.get(route);
    expect(response.status(), route).toBe(200);
    const body = await response.json();
    const rows = Array.isArray(body) ? body : body.data;
    expect(rows.length, route).toBeGreaterThanOrEqual(minimum);
  }

  const vaults = await page.request.get("/api/admin/finance/vaults");
  expect(vaults.status()).toBe(200);
  expect((await vaults.json()).data).toHaveLength(5);
});
