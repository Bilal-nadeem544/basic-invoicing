export function isOverdue(invoice) {
  const today = new Date();
  const due = new Date(invoice.dueDate);
  const unpaidStatuses = ["Sent", "Partially Paid"];
  return due < today && unpaidStatuses.includes(invoice.status);
}

export function getEffectiveStatus(invoice) {
  if (isOverdue(invoice)) return "Overdue";
  return invoice.status;
}

export const statusColorMap = {
  Paid: "success",
  "Partially Paid": "warning",
  Overdue: "danger",
  Draft: "muted",
  Sent: "accent",
  Cancelled: "muted",
};