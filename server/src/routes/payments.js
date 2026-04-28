import express from "express";
import { requireRole } from "../middleware/auth.js";
import { prisma } from "../utils/prisma.js";

const router = express.Router();
router.use(requireRole("ADMIN"));

router.get("/", async (_req, res) => {
  const invoices = await prisma.invoice.findMany({
    include: { client: true },
    orderBy: { dueDate: "desc" }
  });

  const receivedInvoices = invoices.filter((invoice) => invoice.status === "PAID");
  const outstandingInvoices = invoices.filter((invoice) => invoice.status !== "PAID");

  res.json({
    summary: {
      received: receivedInvoices.reduce((sum, invoice) => sum + Number(invoice.total), 0),
      outstanding: outstandingInvoices.reduce((sum, invoice) => sum + Number(invoice.total), 0),
      paymentCount: receivedInvoices.length,
      overdueInvoices: invoices.filter((invoice) => invoice.status === "OVERDUE").length
    },
    payments: receivedInvoices.map((invoice) => ({
      id: invoice.id,
      client: invoice.client,
      invoice,
      amount: invoice.total,
      method: "Manual",
      status: "RECEIVED",
      reference: invoice.invoiceNumber,
      receivedAt: invoice.invoiceDate
    })),
    invoices
  });
});

router.post("/", async (req, res) => {
  const invoice = await prisma.invoice.update({
    where: { id: req.body.invoiceId },
    data: { status: req.body.status === "FAILED" ? "OVERDUE" : req.body.status === "PENDING" ? "SENT" : "PAID" },
    include: { client: true }
  });

  res.status(201).json({
    id: invoice.id,
    client: invoice.client,
    invoice,
    amount: invoice.total,
    method: req.body.method || "Bank Transfer",
    status: req.body.status || "RECEIVED",
    reference: req.body.reference || invoice.invoiceNumber,
    receivedAt: req.body.receivedAt || invoice.invoiceDate,
    notes: req.body.notes || null
  });
});

export default router;
