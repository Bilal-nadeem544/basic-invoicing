import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getInvoices } from "../api/api";
import InvoiceCard from "../components/invoice/InvoiceCard";
import { formatCurrency } from "../utils/formatCurrency";
import { calculateBalance } from "../utils/calculations";

const statusOptions = ["All", "Draft", "Sent", "Partially Paid", "Paid", "Overdue", "Cancelled"];

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getInvoices()
      .then(setInvoices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const outstanding = invoices.reduce((sum, inv) => sum + calculateBalance(inv), 0);
  const paidThisMonth = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.amountPaid, 0);
  const overdueCount = invoices.filter((inv) => inv.effectiveStatus === "Overdue").length;

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const effectiveStatus = inv.effectiveStatus || inv.status;
      const matchesStatus = statusFilter === "All" || effectiveStatus === statusFilter;
      const matchesSearch =
        inv.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [invoices, statusFilter, search]);

  if (loading) {
    return <div className="max-w-2xl mx-auto p-8 text-muted text-sm">Loading invoices...</div>;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-danger text-sm">
        Failed to load invoices: {error}
        <div className="text-muted mt-1">Make sure the backend server is running on port 5000.</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-xl font-semibold">Invoices</h1>
        <Link
          to="/invoices/new"
          className="bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
        >
          + New invoice
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card rounded-lg px-4 py-3">
          <div className="text-xs text-muted uppercase tracking-wide mb-1.5">Outstanding</div>
          <div className="font-mono text-lg font-medium">{formatCurrency(outstanding)}</div>
        </div>
        <div className="bg-card rounded-lg px-4 py-3">
          <div className="text-xs text-muted uppercase tracking-wide mb-1.5">Paid (mo)</div>
          <div className="font-mono text-lg font-medium text-success">
            {formatCurrency(paidThisMonth)}
          </div>
        </div>
        <div className="bg-card rounded-lg px-4 py-3">
          <div className="text-xs text-muted uppercase tracking-wide mb-1.5">Overdue</div>
          <div className="font-mono text-lg font-medium text-danger">{overdueCount}</div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer or invoice #"
          className="flex-1 bg-card border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-card border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        {filteredInvoices.length === 0 ? (
          <div className="text-muted text-sm text-center py-10">No invoices found.</div>
        ) : (
          filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))
        )}
      </div>
    </div>
  );
}

export default InvoiceList;