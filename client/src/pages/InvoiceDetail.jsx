import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getInvoiceById, recordPayment, sendInvoice, cancelInvoice, downloadInvoicePDF } from "../api/api";
import StatusBadge from "../components/invoice/StatusBadge";
import Modal from "../components/ui/Modal";
import PaymentForm from "../components/payment/PaymentForm";
import { formatCurrency } from "../utils/formatCurrency";

function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  function loadInvoice() {
    getInvoiceById(id)
      .then(setInvoice)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadInvoice();
  }, [id]);

  if (loading) {
    return <div className="max-w-2xl mx-auto p-8 text-muted text-sm">Loading...</div>;
  }

  if (error || !invoice) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <p className="text-danger text-sm">{error || "Invoice not found."}</p>
        <Link to="/" className="text-accent text-sm">Back to invoices</Link>
      </div>
    );
  }

  const balance = invoice.total - invoice.amountPaid;
  const effectiveStatus = invoice.effectiveStatus || invoice.status;

  async function handleRecordPayment(payment) {
    setActionLoading(true);
    try {
      await recordPayment(id, payment);
      setPaymentModalOpen(false);
      loadInvoice();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSendInvoice() {
    setActionLoading(true);
    try {
      await sendInvoice(id);
      loadInvoice();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancelInvoice() {
    setActionLoading(true);
    try {
      await cancelInvoice(id);
      loadInvoice();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link to="/" className="text-muted text-sm hover:text-text">← Back to invoices</Link>

      <div className="flex justify-between items-start mt-4 mb-6">
        <div>
          <h1 className="font-display text-xl font-semibold">{invoice.invoiceNumber}</h1>
          <div className="text-sm text-muted mt-1">{invoice.customer?.name}</div>
        </div>
        <StatusBadge status={effectiveStatus} />
      </div>

      {error && (
        <div className="bg-danger/10 text-danger text-sm rounded-md px-4 py-2.5 mb-4">{error}</div>
      )}

      <div className="bg-card rounded-lg p-5 mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <div className="text-xs text-muted uppercase tracking-wide mb-1">Issue date</div>
            <div>{new Date(invoice.issueDate).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-xs text-muted uppercase tracking-wide mb-1">Due date</div>
            <div>{new Date(invoice.dueDate).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          {invoice.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1.5">
              <span>{item.description} <span className="text-muted">× {item.qty}</span></span>
              <span className="font-mono">{formatCurrency(item.lineTotal)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="font-mono">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Tax</span>
            <span className="font-mono">{formatCurrency(invoice.tax)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Discount</span>
            <span className="font-mono">-{formatCurrency(invoice.discount)}</span>
          </div>
          <div className="flex justify-between font-medium text-base pt-2 border-t border-border mt-2">
            <span>Total</span>
            <span className="font-mono">{formatCurrency(invoice.total)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Balance due</span>
            <span className="font-mono">{formatCurrency(balance)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {invoice.status === "Draft" && (
          <>
            <Link
              to={`/invoices/${id}/edit`}
              className="flex-1 bg-card hover:bg-cardHover text-sm font-medium rounded-lg py-2.5 transition-colors text-center"
            >
              Edit
            </Link>
            <button
              onClick={handleSendInvoice}
              disabled={actionLoading}
              className="flex-1 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-50"
            >
              Send invoice
            </button>
          </>
        )}
        <button
          onClick={() => downloadInvoicePDF(id)}
          className="flex-1 bg-card hover:bg-cardHover text-sm font-medium rounded-lg py-2.5 transition-colors"
        >
          Download PDF
        </button>
        {balance > 0 && (
          <button
            onClick={() => setPaymentModalOpen(true)}
            className="flex-1 bg-card hover:bg-cardHover text-sm font-medium rounded-lg py-2.5 transition-colors"
          >
            Record payment
          </button>
        )}
        {invoice.status !== "Cancelled" && invoice.status !== "Paid" && (
          <button
            onClick={handleCancelInvoice}
            disabled={actionLoading}
            className="text-danger hover:bg-danger/10 text-sm font-medium rounded-lg px-4 py-2.5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>

      {invoice.payments?.length > 0 && (
        <div className="mt-6">
          <div className="text-xs text-muted uppercase tracking-wide mb-2">Payment history</div>
          <div className="flex flex-col gap-2">
            {invoice.payments.map((p) => (
              <div key={p.id} className="bg-card rounded-lg px-4 py-3 flex justify-between text-sm">
                <span>{p.method} <span className="text-muted">· {new Date(p.date).toLocaleDateString()}</span></span>
                <span className="font-mono text-success">{formatCurrency(p.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Record payment"
      >
        <PaymentForm
          balance={balance}
          onSubmit={handleRecordPayment}
          onCancel={() => setPaymentModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default InvoiceDetail;