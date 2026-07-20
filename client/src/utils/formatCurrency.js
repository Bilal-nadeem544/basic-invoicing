export function formatCurrency(amount) {
  return "Rs " + Number(amount).toLocaleString("en-PK");
}