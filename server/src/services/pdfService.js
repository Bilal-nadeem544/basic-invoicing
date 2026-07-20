import PDFDocument from "pdfkit";

// Generates a PDF buffer for the given invoice (with items, customer, totals)
export function generateInvoicePDF(invoice) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Header
    doc.fontSize(20).text("Basic Invoicing Co.", { align: "left" });
    doc.fontSize(10).fillColor("#666").text("Invoice", { align: "left" });
    doc.moveDown(1.5);

    // Invoice meta
    doc.fillColor("#000").fontSize(12).text(`Invoice #: ${invoice.invoiceNumber}`);
    doc.text(`Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`);
    doc.text(`Status: ${invoice.status}`);
    doc.moveDown();

    // Customer
    doc.fontSize(12).text(`Bill To: ${invoice.customer?.name || "N/A"}`);
    if (invoice.customer?.email) doc.text(invoice.customer.email);
    doc.moveDown();

    // Line items table header
    doc.fontSize(11).text("Description", 50, doc.y, { continued: true, width: 220 });
    doc.text("Qty", 270, doc.y, { continued: true, width: 60 });
    doc.text("Unit Price", 330, doc.y, { continued: true, width: 100 });
    doc.text("Line Total", 430, doc.y);
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    invoice.items.forEach((item) => {
      const y = doc.y;
      doc.fontSize(10).text(item.description, 50, y, { width: 220 });
      doc.text(String(item.qty), 270, y, { width: 60 });
      doc.text(`Rs ${item.unitPrice.toLocaleString()}`, 330, y, { width: 100 });
      doc.text(`Rs ${item.lineTotal.toLocaleString()}`, 430, y);
      doc.moveDown(0.5);
    });

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Totals
    doc.fontSize(11);
    doc.text(`Subtotal: Rs ${invoice.subtotal.toLocaleString()}`, { align: "right" });
    doc.text(`Tax: Rs ${invoice.tax.toLocaleString()}`, { align: "right" });
    doc.text(`Discount: -Rs ${invoice.discount.toLocaleString()}`, { align: "right" });
    doc.fontSize(13).text(`Total: Rs ${invoice.total.toLocaleString()}`, { align: "right" });
    doc.fontSize(10).fillColor("#666").text(
      `Balance Due: Rs ${(invoice.total - invoice.amountPaid).toLocaleString()}`,
      { align: "right" }
    );

    doc.end();
  });
}