import prisma from "../config/db.js";
import { isOverdue } from "../services/invoiceService.js";

const statusOrder = ["Draft", "Sent", "Partially Paid", "Overdue", "Paid", "Cancelled"];

function getLastSixMonths() {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString("en-US", { month: "short" }),
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }
  return months;
}

export async function getReportsSummary(req, res) {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { payments: true },
    });

    const months = getLastSixMonths();

    const monthlyRevenue = months.map(({ label, year, month }) => {
      let paid = 0;
      let outstanding = 0;

      invoices.forEach((inv) => {
        inv.payments.forEach((p) => {
          const pd = new Date(p.date);
          if (pd.getFullYear() === year && pd.getMonth() === month) {
            paid += p.amount;
          }
        });

        const issueDate = new Date(inv.issueDate);
        if (
          issueDate.getFullYear() === year &&
          issueDate.getMonth() === month &&
          inv.status !== "Cancelled"
        ) {
          outstanding += inv.total - inv.amountPaid;
        }
      });

      return { month: label, paid: Math.round(paid), outstanding: Math.round(outstanding) };
    });

    const statusCounts = statusOrder.map((status) => ({
      status,
      count: invoices.filter((inv) => {
        const effective = isOverdue(inv) ? "Overdue" : inv.status;
        return effective === status;
      }).length,
    }));

    res.json({ monthlyRevenue, statusCounts, totalInvoices: invoices.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}