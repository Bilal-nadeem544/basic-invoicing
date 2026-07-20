import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getReportsSummary } from "../api/api";
import { formatCurrency } from "../utils/formatCurrency";

const statusColors = {
  Draft: "#9CA6B8",
  Sent: "#5B6EF5",
  "Partially Paid": "#FBBF24",
  Overdue: "#F87171",
  Paid: "#34D399",
  Cancelled: "#9CA6B8",
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-card border border-border rounded-md px-3 py-2 text-xs">
      <div className="text-muted mb-1">{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{ color: entry.color }}>
          {entry.dataKey === "paid" ? "Paid" : "Outstanding"}: {formatCurrency(entry.value)}
        </div>
      ))}
    </div>
  );
}

function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getReportsSummary()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-2xl mx-auto p-8 text-muted text-sm">Loading reports...</div>;
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-danger text-sm">
        Failed to load reports: {error}
      </div>
    );
  }

  const totalPaid = data.monthlyRevenue.reduce((sum, m) => sum + m.paid, 0);
  const totalOutstanding = data.monthlyRevenue.reduce((sum, m) => sum + m.outstanding, 0);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="font-display text-xl font-semibold mb-6">Reports</h1>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card rounded-lg px-4 py-3">
          <div className="text-xs text-muted uppercase tracking-wide mb-1.5">Total paid (6mo)</div>
          <div className="font-mono text-lg font-medium text-success">
            {formatCurrency(totalPaid)}
          </div>
        </div>
        <div className="bg-card rounded-lg px-4 py-3">
          <div className="text-xs text-muted uppercase tracking-wide mb-1.5">Total outstanding</div>
          <div className="font-mono text-lg font-medium text-danger">
            {formatCurrency(totalOutstanding)}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-5 mb-6">
        <div className="text-xs text-muted uppercase tracking-wide mb-4">Revenue — last 6 months</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#33415C" vertical={false} />
            <XAxis dataKey="month" stroke="#9CA6B8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9CA6B8" fontSize={12} tickLine={false} axisLine={false} width={40} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#2C3952" }} />
            <Bar dataKey="paid" fill="#34D399" radius={[4, 4, 0, 0]} />
            <Bar dataKey="outstanding" fill="#F87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-lg p-5">
        <div className="text-xs text-muted uppercase tracking-wide mb-4">Invoices by status</div>
        <div className="flex flex-col gap-2.5">
          {data.statusCounts.map(({ status, count }) => (
            <div key={status} className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-36">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: statusColors[status] }}
                />
                <span className="text-sm">{status}</span>
              </div>
              <div className="flex-1 bg-base rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: data.totalInvoices ? `${(count / data.totalInvoices) * 100}%` : "0%",
                    backgroundColor: statusColors[status],
                  }}
                />
              </div>
              <span className="font-mono text-sm text-muted w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;