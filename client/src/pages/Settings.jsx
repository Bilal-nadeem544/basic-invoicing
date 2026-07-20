import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "../api/api";

function Settings() {
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [defaultTaxRate, setDefaultTaxRate] = useState(10);
  const [invoicePrefix, setInvoicePrefix] = useState("INV-");
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState("Net 15");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSettings()
      .then((s) => {
        setBusinessName(s.businessName || "");
        setBusinessEmail(s.businessEmail || "");
        setBusinessAddress(s.businessAddress || "");
        setDefaultTaxRate(s.defaultTaxRate ?? 10);
        setInvoicePrefix(s.invoicePrefix || "INV-");
        setDefaultPaymentTerms(s.defaultPaymentTerms || "Net 15");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateSettings({
        businessName,
        businessEmail,
        businessAddress,
        defaultTaxRate: Number(defaultTaxRate),
        invoicePrefix,
        defaultPaymentTerms,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="max-w-2xl mx-auto p-8 text-muted text-sm">Loading settings...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="font-display text-xl font-semibold mb-6">Settings</h1>

      {error && (
        <div className="bg-danger/10 text-danger text-sm rounded-md px-4 py-2.5 mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="bg-card rounded-lg p-5">
          <div className="text-xs text-muted uppercase tracking-wide mb-4">Business info</div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-muted uppercase tracking-wide block mb-1.5">
                Business name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-base border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs text-muted uppercase tracking-wide block mb-1.5">
                Business email
              </label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="billing@yourbusiness.com"
                className="w-full bg-base border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs text-muted uppercase tracking-wide block mb-1.5">
                Business address
              </label>
              <textarea
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                rows={2}
                placeholder="Street, City, Country"
                className="w-full bg-base border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-5">
          <div className="text-xs text-muted uppercase tracking-wide mb-4">Invoice defaults</div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted uppercase tracking-wide block mb-1.5">
                Default tax rate (%)
              </label>
              <input
                type="number"
                value={defaultTaxRate}
                onChange={(e) => setDefaultTaxRate(e.target.value)}
                min="0"
                className="w-full bg-base border border-border rounded-md px-3 py-2 text-sm font-mono outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs text-muted uppercase tracking-wide block mb-1.5">
                Default payment terms
              </label>
              <select
                value={defaultPaymentTerms}
                onChange={(e) => setDefaultPaymentTerms(e.target.value)}
                className="w-full bg-base border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
              >
                <option>Net 7</option>
                <option>Net 15</option>
                <option>Net 30</option>
                <option>Due on receipt</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-xs text-muted uppercase tracking-wide block mb-1.5">
                Invoice number prefix
              </label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                className="w-full bg-base border border-border rounded-md px-3 py-2 text-sm font-mono outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save settings"}
        </button>
      </form>
    </div>
  );
}

export default Settings;