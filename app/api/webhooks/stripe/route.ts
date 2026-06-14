import { NextRequest } from "next/server";
import Stripe from "stripe";
import { json, prisma } from "@/lib/api";
import { sendEmail, adminEmail } from "@/lib/resend";
import { recordClearedInvoicePayment } from "@/lib/money";
import { stripe } from "@/lib/stripe";
import { formatMoney } from "@/lib/utils";
import { logSecurityEvent } from "@/lib/security-events";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET.includes("...")) {
      return json({ error: "Stripe webhook secret is not configured." }, 503);
    }
    if (!signature) return json({ error: "Missing Stripe signature." }, 400);
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Invalid Stripe webhook." }, 400);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const invoiceId = intent.metadata?.invoiceId;
    if (!invoiceId) return json({ received: true, ignored: "No invoice metadata." });
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { client: true } });
    if (!invoice) {
      await logSecurityEvent({ type: "WEBHOOK_FAILURE", severity: "HIGH", source: "stripe", description: "Stripe payment succeeded for an unknown invoice.", metadata: { paymentIntentId: intent.id, invoiceId } });
      return json({ received: true, ignored: "Invoice not found." });
    }
    if (intent.amount_received < invoice.total) {
      await logSecurityEvent({ type: "STRIPE_RISK", severity: "HIGH", source: "stripe", email: invoice.client.email, description: "Stripe payment amount was lower than the invoice total.", metadata: { paymentIntentId: intent.id, received: intent.amount_received, expected: invoice.total } });
      return json({ received: true, ignored: "Underpayment not marked paid." });
    }
    if (intent.amount_received > invoice.total) {
      const excess = intent.amount_received - invoice.total;
      const charge = typeof intent.latest_charge === "string" ? intent.latest_charge : intent.latest_charge?.id;
      if (charge) {
        await stripe.refunds.create({
          charge,
          amount: excess,
          reason: "requested_by_customer",
          metadata: { invoiceId, paymentIntentId: intent.id, reason: "automatic_overpayment_refund" },
        }, { idempotencyKey: `overpayment-refund:${intent.id}` });
      }
      await logSecurityEvent({ type: "OVERPAYMENT", severity: "HIGH", source: "stripe", email: invoice.client.email, description: "Stripe payment exceeded invoice total; excess refund requested.", metadata: { paymentIntentId: intent.id, received: intent.amount_received, expected: invoice.total, excess } });
    }

    const result = await recordClearedInvoicePayment({
      invoiceId,
      stripePaymentIntentId: intent.id,
      amount: invoice.total,
      reference: typeof intent.latest_charge === "string" ? intent.latest_charge : intent.latest_charge?.id,
    });

    if (!result.alreadyProcessed && "invoice" in result) {
      if (invoice) {
        await sendEmail({
          to: invoice.client.email,
          subject: `Receipt for ${invoice.invoiceNumber} - KRAVEX`,
          html: `<p>Thank you. We received ${formatMoney(intent.amount_received)} for invoice ${invoice.invoiceNumber}.</p>`,
        });
        await sendEmail({
          to: adminEmail,
          subject: `Payment received - ${invoice.invoiceNumber}`,
          html: `<p>${invoice.client.businessName} paid ${formatMoney(intent.amount_received)}.</p><p>The payment was split into KRAVEX vaults automatically.</p>`,
        });
      }
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    await prisma.moneyLedgerEntry.create({
      data: {
        invoiceId: intent.metadata?.invoiceId,
        type: "PAYMENT_RECEIVED",
        amount: intent.amount,
        status: "FAILED",
        reference: intent.id,
        notes: intent.last_payment_error?.message || "Stripe payment failed.",
      },
    });
    await sendEmail({
      to: adminEmail,
      subject: "KRAVEX payment failed",
      html: `<p>Payment failed for invoice ${intent.metadata?.invoiceNumber || "unknown"}.</p>`,
    });
    await logSecurityEvent({ type: "STRIPE_RISK", severity: "MEDIUM", source: "stripe", description: "Stripe payment failed.", metadata: { paymentIntentId: intent.id, invoiceId: intent.metadata?.invoiceId, error: intent.last_payment_error?.message } });
  }

  if (event.type === "payout.paid") {
    const payout = event.data.object as Stripe.Payout;
    await prisma.moneyLedgerEntry.updateMany({
      where: { reference: payout.id, type: "OWNER_WITHDRAWAL_REQUEST" },
      data: { status: "PAID_OUT", clearedAt: new Date(), notes: "Owner payout paid to bank account." },
    });
    await prisma.moneyLedgerEntry.create({
      data: {
        vaultKey: "owner",
        type: "BANK_PAYOUT",
        amount: payout.amount,
        status: "PAID_OUT",
        reference: payout.id,
        notes: "Stripe payout confirmed paid.",
        clearedAt: new Date(),
      },
    });
    await sendEmail({
      to: adminEmail,
      subject: "Owner payout paid - KRAVEX",
      html: `<p>${formatMoney(payout.amount)} has been paid out to the verified bank account.</p>`,
    });
  }

  if (event.type === "payout.failed") {
    const payout = event.data.object as Stripe.Payout;
    await prisma.$transaction(async (tx) => {
      await tx.moneyLedgerEntry.updateMany({
        where: { reference: payout.id, type: "OWNER_WITHDRAWAL_REQUEST" },
        data: { status: "FAILED", notes: payout.failure_message || "Stripe payout failed." },
      });
      await tx.moneyVault.update({
        where: { key: "owner" },
        data: { balance: { increment: payout.amount } },
      });
      await tx.moneyLedgerEntry.create({
        data: {
          vaultKey: "owner",
          type: "ADJUSTMENT",
          amount: payout.amount,
          status: "AVAILABLE",
          reference: payout.id,
          notes: "Owner Pay vault re-credited after failed Stripe payout.",
          clearedAt: new Date(),
        },
      });
    });
    await sendEmail({
      to: adminEmail,
      subject: "Owner payout failed - KRAVEX",
      html: `<p>${formatMoney(payout.amount)} could not be paid out. The Owner Pay vault was re-credited.</p>`,
    });
  }

  return json({ received: true });
}
