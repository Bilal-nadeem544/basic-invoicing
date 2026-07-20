// Subtotal = sum of (qty * unitPrice)
export function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
}

// Total = Subtotal + Tax - Discount
export function calculateTotal({ subtotal, tax = 0, discount = 0 }) {
  return subtotal + tax - discount;
}

// Determines invoice status based on payments received
export function determineStatus(total, amountPaid, currentStatus) {
  if (currentStatus === "Cancelled") return "Cancelled";
  if (amountPaid >= total) return "Paid";
  if (amountPaid > 0) return "Partially Paid";
  return currentStatus === "Draft" ? "Draft" : currentStatus;
}

// Checks if invoice is overdue (past due date, not fully paid/cancelled)
export function isOverdue(invoice) {
  const today = new Date();
  const unpaidStatuses = ["Sent", "Partially Paid"];
  return new Date(invoice.dueDate) < today && unpaidStatuses.includes(invoice.status);
}