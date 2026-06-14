import { expect, Page } from "@playwright/test";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for authenticated tests.`);
  return value;
}

export async function loginAsAdmin(page: Page) {
  await login(page, "emdadul.hoque@kravex.co.uk", requiredEnv("E2E_ADMIN_PASSWORD"), "/admin/dashboard");
}

export async function loginAsClient(page: Page) {
  await login(page, "patel@pateldental.co.uk", requiredEnv("E2E_CLIENT_PASSWORD"), "/client/dashboard");
}

async function login(page: Page, email: string, password: string, destination: string) {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(new RegExp(`${destination.replace("/", "\\/")}$`), { timeout: 8_000 });
}
