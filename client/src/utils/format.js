export const gbp = (value) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(Number(value || 0));
export const dateUk = (value) => value ? new Date(value).toLocaleDateString("en-GB") : "-";
export const label = (value) => String(value || "").replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

export const sortRows = (rows, key, direction = "asc") =>
  [...rows].sort((a, b) => {
    const av = String(a[key] ?? "");
    const bv = String(b[key] ?? "");
    return direction === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

export const downloadBlob = (content, filename, type = "text/csv") => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
