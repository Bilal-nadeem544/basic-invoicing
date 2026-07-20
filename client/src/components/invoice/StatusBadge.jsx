import { statusColorMap } from "../../utils/invoiceStatus";

const colorClasses = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  accent: "bg-accent/15 text-accent",
  muted: "bg-muted/15 text-muted",
};

const dotClasses = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  accent: "bg-accent",
  muted: "bg-muted",
};

function StatusBadge({ status }) {
  const color = statusColorMap[status] || "muted";

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${colorClasses[color]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClasses[color]}`} />
      {status}
    </div>
  );
}

export default StatusBadge;