import { test } from "@playwright/test";

test("Stripe test payment success and decline flows", async () => {
  test.skip(
    process.env.RUN_STRIPE_E2E !== "true",
    "Set RUN_STRIPE_E2E=true only with Stripe CLI webhook forwarding and dedicated test invoices.",
  );

  throw new Error("Run this test only with Stripe CLI webhook forwarding and dedicated test invoices.");
});
