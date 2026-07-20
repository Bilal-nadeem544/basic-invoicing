import prisma from "../config/db.js";
import { determineStatus } from "../services/invoiceService.js";

export async function recordPayment(req, res) {
  try {
    const { amount, date, method, note } = req.body;
    const invoiceId = req.params.id;

    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    const payment = await prisma.payment.create({
      data: { invoiceId, amount, date: new Date(date), method, note },
    });

    const newAmountPaid = invoice.amountPaid + amount;
    const newStatus = determineStatus(invoice.total, newAmountPaid, invoice.status);

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { amountPaid: newAmountPaid, status: newStatus },
      include: { payments: true },
    });

    res.status(201).json({ payment, invoice: updatedInvoice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}