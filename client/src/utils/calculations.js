// Subtotal = sum of (qty * unitPrice) across all line items
export function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
}

// Total = Subtotal + Tax - Discount
export function calculateTotal({ subtotal, tax = 0, discount = 0 }) {
  return subtotal + tax - discount;
}

// Balance still owed on an invoice
export function calculateBalance(invoice) {
  return invoice.total - invoice.amountPaid;
}