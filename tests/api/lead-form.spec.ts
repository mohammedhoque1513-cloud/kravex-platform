import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

const prisma = new PrismaClient();

test.afterAll(async () => {
  await prisma.$disconnect();
});

test("valid lead submission persists to PostgreSQL", async ({ request }) => {
  const email = `audit-${Date.now()}@auditroofing.co.uk`;
  const response = await request.post("/api/lead-form", {
    headers: { "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 100) + 1}` },
    data: {
      name: "Audit Lead",
      businessName: "Audit Roofing Ltd",
      email,
      phone: "07123456789",
      service: "Roofing & Trades",
      city: "Birmingham",
      budget: "£1,000 - £2,000",
      referralSource: "Google",
      source: "GET_STARTED",
      message: "Automated persistence check.",
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.success).toBe(true);
  expect(body.id).toBeTruthy();

  const saved = await prisma.leadForm.findUnique({ where: { id: body.id } });
  expect(saved?.email).toBe(email);
});

test("invalid lead submission returns field details", async ({ request }) => {
  const response = await request.post("/api/lead-form", {
    headers: { "x-forwarded-for": `203.0.113.${Math.floor(Math.random() * 100) + 1}` },
    data: { name: "" },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toBe("Invalid form data");
  expect(body.details?.fieldErrors).toBeTruthy();
});
