import { useState } from "react";

const methods = ["Cash", "Bank Transfer", "Card", "Other"];

function PaymentForm({ balance, onSubmit, onCancel }) {
  const [amount, setAmount] = useState(balance);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState("Cash");
  const [note, setNote] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ amount: Number(amount), date, method, note });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-muted uppercase tracking-wide block mb-1.5">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          max={balance}
          min="1"
          required
          className="w-full bg-base border border-border rounded-md px-3 py-2 text-sm font-mono outline-none focus:border-accent"
        />
        <div className="text-xs text-muted mt-1">Balance due: Rs {balance.toLocaleString()}</div>
      </div>

      <div>
        <label className="text-xs text-muted uppercase tracking-wide block mb-1.5">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full bg-base border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="text-xs text-muted uppercase tracking-wide block mb-1.5">
          Payment method
        </label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full bg-base border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
        >
          {methods.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-muted uppercase tracking-wide block mb-1.5">
          Note (optional)
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Advance payment"
          className="w-full bg-base border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="flex gap-3 mt-1">
        <button
          type="submit"
          className="flex-1 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
        >
          Record payment
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-base hover:bg-cardHover text-sm font-medium rounded-lg py-2.5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default PaymentForm;




