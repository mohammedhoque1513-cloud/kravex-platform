export const toMoney = (value) => Number(value || 0).toFixed(2);

export const monthRange = (date = new Date()) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
};

export const normaliseEnum = (value) => String(value || "").trim().toUpperCase().replaceAll(" ", "_").replaceAll("-", "_");

export const invoiceTotals = (lineItems = [], vatEnabled = false) => {
  const subtotal = lineItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const vatAmount = vatEnabled ? subtotal * 0.2 : 0;
  return {
    subtotal: Number(subtotal.toFixed(2)),
    vatAmount: Number(vatAmount.toFixed(2)),
    total: Number((subtotal + vatAmount).toFixed(2))
  };
};
