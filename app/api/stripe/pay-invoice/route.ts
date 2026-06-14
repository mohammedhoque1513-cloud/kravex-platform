import { NextRequest } from "next/server";
import { json, prisma, readJson, requireRole } from "@/lib/api";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const auth = await requireRole("CLIENT");
  if ("error" in auth) return auth.error;

  const { invoiceId } = await readJson(req);
  if (!invoiceId || typeof invoiceId !== "string") return json({ error: "Invoice ID is required." }, 400);

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, clientId: auth.user.clientId, deletedAt: null },
    include: { client: true },
  });
  if (!invoice) return json({ error: "Invoice not found." }, 404);
  if (invoice.status === "PAID") return json({ error: "This invoice has already been paid." }, 400);
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("...")) {
    return json({ error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY before taking payments." }, 503);
  }

  const intent = await stripe.paymentIntents.create({
    amount: invoice.total,
    currency: "gbp",
    automatic_payment_methods: { enabled: true },
    metadata: {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      clientName: invoice.client.businessName,
    },
    description: `KRAVEX invoice ${invoice.invoiceNumber}`,
    receipt_email: invoice.client.email,
  }, {
    idempotencyKey: `invoice:${invoice.id}:payment-intent`,
  });

  return json({
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
    amount: invoice.total,
    currency: "gbp",
  });
}
