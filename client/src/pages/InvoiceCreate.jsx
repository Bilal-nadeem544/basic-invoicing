import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCustomers, createCustomer, createInvoice, getInvoiceById, updateInvoice } from "../api/api";
import { formatCurrency } from "../utils/formatCurrency";
import { calculateSubtotal, calculateTotal } from "../utils/calculations";

function InvoiceCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [showNewCustomer, setShowNewCustomer] = useState(false);

  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taxRate, setTaxRate] = useState(10);
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState([{ description: "", qty: 1, unitPrice: 0 }]);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCustomers().then(setCustomers).catch(() => setCustomers([]));
  }, []);

  useEffect(() => {
    if (isEditMode) {
      getInvoiceById(id)
        .then((inv) => {
          setCustomerId(inv.customerId);
          setIssueDate(inv.issueDate.slice(0, 10));
          setDueDate(inv.dueDate.slice(0, 10));
          setTaxRate(Math.round((inv.tax / inv.subtotal) * 100) || 0);
          setDiscount(inv.discount);
          setItems(inv.items.map((it) => ({ description: it.description, qty: it.qty, unitPrice: it.unitPrice })));
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const subtotal = calculateSubtotal(items);
  const tax = Math.round(subtotal * (taxRate / 100));
  const total = calculateTotal({ subtotal, tax, discount: Number(discount) });

  function updateItem(index, field, value) {
    const updated = [...items];
    updated[index][field] = field === "description" ? value : Number(value);
    setItems(updated);
  }

  function addItem() {
    setItems([...items, { description: "", qty: 1, unitPrice: 0 }]);
  }

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let finalCustomerId = customerId;

      if (showNewCustomer && newCustomerName) {
        const newCustomer = await createCustomer({
          name: newCustomerName,
          email: newCustomerEmail || undefined,
        });
        finalCustomerId = newCustomer.id;
      }

      const payload = {
        customerId: finalCustomerId,
        items,
        taxRate,
        discount: Number(discount),
        issueDate,
        dueDate,
      };

      if (isEditMode) {
        await updateInvoice(id, payload);
        navigate(`/invoices/${id}`);
      } else {
        const created = await createInvoice(payload);
        navigate(`/invoices/${created.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="max-w-2xl mx-auto p-8 text-muted text-sm">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link to={isEditMode ? `/invoices/${id}` : "/"} className="text-muted text-sm hover:text-text">
        ← Back
      </Link>

      <h1 className="font-display text-xl font-semibold mt-4 mb-6">
        {isEditMode ? "Edit invoice" : "New invoice"}
      </h1>

      {error && (
        <div className="bg-danger/10 text-danger text-sm rounded-md px-4 py-2.5 mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="bg-card rounded-lg p-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3">
              <label className="text-xs text-muted uppercase tracking-wide block mb-1.5">
                Customer
              </label>

              {!showNewCustomer ? (
                <>
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    required
                    className="w-full bg-base border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
                  >
                    <option value="">Select customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCustomer(true)}
                    className="text-accent text-xs mt-1.5 hover:underline"
                  >
                    + Add new customer
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="Customer name"
                    required
                    className="flex-1 bg-base border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <input
                    type="email"
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="Email (for sending invoice)"
                    className="flex-1 bg-base border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewCustomer(false)}
                    className="text-muted text-xs hover:underline whitespace-nowrap"
                  >
                    Use existing
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-wide block mb-1.5">
                Issue date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
                className="w-full bg-base border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-wide block mb-1.5">
                Due date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full bg-base border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-5">
          <div className="text-xs text-muted uppercase tracking-wide mb-3">Line items</div>

          <div className="flex flex-col gap-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(i, "description", e.target.value)}
                  placeholder="Description"
                  required
                  className="flex-1 bg-base border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
                />
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => updateItem(i, "qty", e.target.value)}
                  min="1"
                  className="w-16 bg-base border border-border rounded-md px-2 py-2 text-sm font-mono outline-none focus:border-accent"
                />
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(i, "unitPrice", e.target.value)}
                  min="0"
                  placeholder="Price"
                  className="w-24 bg-base border border-border rounded-md px-2 py-2 text-sm font-mono outline-none focus:border-accent"
                />
                <span className="font-mono text-sm w-24 text-right text-muted">
                  {formatCurrency(item.qty * item.unitPrice)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="text-muted hover:text-danger text-sm px-1"
                  disabled={items.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="text-accent text-sm mt-3 hover:underline"
          >
            + Add line item
          </button>
        </div>

        <div className="bg-card rounded-lg p-5">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted uppercase tracking-wide block mb-1.5">
                Tax rate (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                min="0"
                className="w-full bg-base border border-border rounded-md px-3 py-2 text-sm font-mono outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-wide block mb-1.5">
                Discount (flat)
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                min="0"
                className="w-full bg-base border border-border rounded-md px-3 py-2 text-sm font-mono outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Tax ({taxRate}%)</span>
              <span className="font-mono">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Discount</span>
              <span className="font-mono">-{formatCurrency(discount)}</span>
            </div>
            <div className="flex justify-between font-medium text-base pt-2 border-t border-border mt-2">
              <span>Total</span>
              <span className="font-mono">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : isEditMode ? "Save changes" : "Save invoice"}
          </button>
          <Link
            to={isEditMode ? `/invoices/${id}` : "/"}
            className="flex-1 bg-card hover:bg-cardHover text-sm font-medium rounded-lg py-2.5 transition-colors text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default InvoiceCreate;