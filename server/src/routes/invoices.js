import express from "express";
import PDFDocument from "pdfkit";
import { reqIsAdmin, requireRole } from "../middleware/auth.js";
import { invoiceTotals, toMoney } from "../utils/format.js";
import { prisma } from "../utils/prisma.js";

const router = express.Router();

const generateNumber = async () => {
  const count = await prisma.invoice.count();
  return `KRX-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
};

router.get("/", async (req, res) => {
  const clientId = reqIsAdmin(req) ? req.query.clientId : req.user.clientId;
  const invoices = await prisma.invoice.findMany({ where: { ...(clientId ? { clientId } : {}) }, include: { client: true }, orderBy: { dueDate: "desc" } });
  res.json(invoices);
});

router.post("/", requireRole("ADMIN"), async (req, res) => {
  const lineItems = req.body.lineItems?.length ? req.body.lineItems : [{ description: req.body.description || "Lead Generation Retainer", amount: Number(req.body.amount || 0) }];
  const totals = invoiceTotals(lineItems, req.body.vatEnabled);
  const invoice = await prisma.invoice.create({
    data: {
      clientId: req.body.clientId,
      invoiceNumber: req.body.invoiceNumber || await generateNumber(),
      invoiceDate: new Date(req.body.invoiceDate || Date.now()),
      dueDate: new Date(req.body.dueDate),
      lineItems,
      subtotal: totals.subtotal,
      vatAmount: totals.vatAmount,
      total: totals.total,
      status: req.body.status || "DRAFT"
    },
    include: { client: true }
  });
  res.status(201).json(invoice);
});

router.put("/:id", requireRole("ADMIN"), async (req, res) => {
  const invoice = await prisma.invoice.update({ where: { id: req.params.id }, data: req.body });
  res.json(invoice);
});

router.post("/:id/paid", requireRole("ADMIN"), async (req, res) => {
  const invoice = await prisma.invoice.update({ where: { id: req.params.id }, data: { status: "PAID" } });
  res.json(invoice);
});

router.get("/:id/pdf", async (req, res) => {
  const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id }, include: { client: true } });
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });
  if (!reqIsAdmin(req) && req.user.clientId !== invoice.clientId) return res.status(403).json({ message: "Forbidden" });
  const settings = await prisma.agencySetting.findFirst();
  const doc = new PDFDocument({ margin: 48 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${invoice.invoiceNumber}.pdf`);
  doc.pipe(res);
  doc.fontSize(22).text(settings?.agencyName || "KRAVEX");
  doc.fontSize(10).text(settings?.address || "UK Lead Generation Agency").text(settings?.vatNumber ? `VAT: ${settings.vatNumber}` : "Logo placeholder");
  doc.moveDown().fontSize(18).text(`Invoice ${invoice.invoiceNumber}`);
  doc.fontSize(10).text(`Invoice date: ${invoice.invoiceDate.toLocaleDateString("en-GB")}`).text(`Due date: ${invoice.dueDate.toLocaleDateString("en-GB")}`);
  doc.moveDown().text(`Bill to: ${invoice.client.businessName}`).text(invoice.client.email);
  doc.moveDown();
  invoice.lineItems.forEach((item) => doc.text(`${item.description} - GBP ${toMoney(item.amount)}`));
  doc.moveDown().text(`Subtotal: GBP ${toMoney(invoice.subtotal)}`).text(`VAT: GBP ${toMoney(invoice.vatAmount)}`).fontSize(14).text(`Total: GBP ${toMoney(invoice.total)}`);
  doc.end();
});

export default router;
