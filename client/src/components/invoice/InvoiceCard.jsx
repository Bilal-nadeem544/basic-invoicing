import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";
import { statusColorMap } from "../../utils/invoiceStatus";

const borderColorClasses = {
  success: "border-l-success",
  warning: "border-l-warning",
  danger: "border-l-danger",
  accent: "border-l-accent",
  muted: "border-l-muted",
};

function InvoiceCard({ invoice }) {
  const effectiveStatus = invoice.effectiveStatus || invoice.status;
  const color = statusColorMap[effectiveStatus] || "muted";

  const formattedDueDate = new Date(invoice.dueDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

  return (
    <Link
      to={`/invoices/${invoice.id}`}
      className={`flex justify-between items-center bg-card hover:bg-cardHover border-l-3 ${borderColorClasses[color]} rounded-lg px-4 py-3.5 transition-colors`}
    >
      <div>
        <div className="text-sm font-medium">{invoice.customer?.name}</div>
        <div className="font-mono text-xs text-muted mt-0.5">
          {invoice.invoiceNumber} &nbsp;·&nbsp; Due {formattedDueDate}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="font-mono text-[15px] font-medium">
          {formatCurrency(invoice.total)}
        </div>
        <StatusBadge status={effectiveStatus} />
      </div>
    </Link>
  );
}

export default InvoiceCard;