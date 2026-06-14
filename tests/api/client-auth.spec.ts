import { expect, test } from "@playwright/test";
import { loginAsClient } from "../helpers/auth";

test("client session sees client data and cannot call admin APIs", async ({ page }) => {
  await loginAsClient(page);

  for (const route of ["/api/client/dashboard", "/api/client/leads", "/api/client/invoices"]) {
    const response = await page.request.get(route);
    expect(response.status(), route).toBe(200);
  }

  const forbidden = await page.request.get("/api/admin/clients");
  expect([401, 403]).toContain(forbidden.status());
});
