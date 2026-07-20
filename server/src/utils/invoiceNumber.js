import prisma from "../config/db.js";

// Generates the next sequential invoice number, e.g. INV-0046
export async function generateInvoiceNumber() {
  const lastInvoice = await prisma.invoice.findFirst({
    orderBy: { createdAt: "desc" },
  });

  let nextNumber = 1;
  if (lastInvoice) {
    const lastNum = parseInt(lastInvoice.invoiceNumber.replace("INV-", ""), 10);
    nextNumber = lastNum + 1;
  }

  return `INV-${String(nextNumber).padStart(4, "0")}`;
}