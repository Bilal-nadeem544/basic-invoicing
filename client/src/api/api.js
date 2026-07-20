const BASE_URL = "http://localhost:5000/api/invoicing";

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Request failed");
  }
  return res.json();
}

// Invoices
export function getInvoices() {
  return fetch(`${BASE_URL}/invoices`).then(handleResponse);
}

export function getInvoiceById(id) {
  return fetch(`${BASE_URL}/invoices/${id}`).then(handleResponse);
}

export function createInvoice(data) {
  return fetch(`${BASE_URL}/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

export function updateInvoice(id, data) {
  return fetch(`${BASE_URL}/invoices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

export function cancelInvoice(id) {
  return fetch(`${BASE_URL}/invoices/${id}`, { method: "DELETE" }).then(handleResponse);
}

export function sendInvoice(id) {
  return fetch(`${BASE_URL}/invoices/${id}/send`, { method: "POST" }).then(handleResponse);
}

export function downloadInvoicePDF(id) {
  window.open(`${BASE_URL}/invoices/${id}/pdf`, "_blank");
}

// Payments
export function recordPayment(invoiceId, data) {
  return fetch(`${BASE_URL}/invoices/${invoiceId}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

// Customers
export function getCustomers() {
  return fetch(`${BASE_URL}/customers`).then(handleResponse);
}

export function createCustomer(data) {
  return fetch(`${BASE_URL}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

// Reports
export function getReportsSummary() {
  return fetch(`${BASE_URL}/reports/summary`).then(handleResponse);
}

// Settings
export function getSettings() {
  return fetch(`${BASE_URL}/settings`).then(handleResponse);
}

export function updateSettings(data) {
  return fetch(`${BASE_URL}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
}