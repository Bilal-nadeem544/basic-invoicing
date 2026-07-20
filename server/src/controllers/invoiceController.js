import prisma from "../config/db.js";
import { generateInvoiceNumber } from "../utils/invoiceNumber.js";
import { calculateSubtotal, calculateTotal, isOverdue } from "../services/invoiceService.js";
import { generateInvoicePDF } from "../services/pdfService.js";
import { sendInvoiceEmail } from "../services/emailService.js";

export async function createInvoice(req, res) {
  try {
    const { customerId, items, taxRate = 0, discount = 0, issueDate, dueDate } = req.body;

    const subtotal = calculateSubtotal(items);
    const tax = Math.round(subtotal * (taxRate / 100));
    const total = calculateTotal({ subtotal, tax, discount });
    const invoiceNumber = await generateInvoiceNumber();

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId,
        subtotal,
        tax,
        discount,
        total,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        items: {
          create: items.map((item) => ({
            description: item.description,
            qty: item.qty,
            unitPrice: item.unitPrice,
            lineTotal: item.qty * item.unitPrice,
          })),
        },
      },
      include: { items: true, customer: true },
    });

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getInvoices(req, res) {
  try {
    const { status, customerId } = req.query;

    const invoices = await prisma.invoice.findMany({
      where: {
        ...(status && { status }),
        ...(customerId && { customerId }),
      },
      include: { items: true, payments: true, customer: true },
      orderBy: { createdAt: "desc" },
    });

    const withEffectiveStatus = invoices.map((inv) => ({
      ...inv,
      effectiveStatus: isOverdue(inv) ? "Overdue" : inv.status,
    }));

    res.json(withEffectiveStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getInvoiceById(req, res) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { items: true, payments: true, customer: true },
    });

    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    res.json({ ...invoice, effectiveStatus: isOverdue(invoice) ? "Overdue" : invoice.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateInvoice(req, res) {
  try {
    const { items, taxRate, discount, issueDate, dueDate, customerId } = req.body;

    const subtotal = items ? calculateSubtotal(items) : undefined;
    const tax = subtotal !== undefined ? Math.round(subtotal * (taxRate / 100)) : undefined;
    const total = subtotal !== undefined ? calculateTotal({ subtotal, tax, discount }) : undefined;

    if (items) {
      await prisma.invoiceItem.deleteMany({ where: { invoiceId: req.params.id } });
    }

    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        ...(customerId && { customerId }),
        ...(subtotal !== undefined && { subtotal, tax, total, discount }),
        ...(issueDate && { issueDate: new Date(issueDate) }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(items && {
          items: {
            create: items.map((item) => ({
              description: item.description,
              qty: item.qty,
              unitPrice: item.unitPrice,
              lineTotal: item.qty * item.unitPrice,
            })),
          },
        }),
      },
      include: { items: true, customer: true },
    });

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function cancelInvoice(req, res) {
  try {
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: { status: "Cancelled" },
    });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function downloadInvoicePDF(req, res) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { items: true, customer: true },
    });
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    const pdfBuffer = await generateInvoicePDF(invoice);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${invoice.invoiceNumber}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function emailInvoice(req, res) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { items: true, customer: true },
    });
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    if (!invoice.customer?.email) {
      return res.status(400).json({ error: "Customer has no email on file" });
    }

    const pdfBuffer = await generateInvoicePDF(invoice);
    await sendInvoiceEmail({
      toEmail: invoice.customer.email,
      invoiceNumber: invoice.invoiceNumber,
      pdfBuffer,
    });

    const updated = await prisma.invoice.update({
      where: { id: req.params.id },
      data: { status: "Sent" },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}