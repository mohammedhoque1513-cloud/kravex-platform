import { ArrowDownUp, Search } from "lucide-react";
import { forwardRef, useMemo, useState } from "react";
import { sortRows } from "../utils/format";

export const Button = ({ children, variant = "primary", className = "", ...props }) => (
  <button {...props} className={`focus-ring inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variant === "primary" ? "bg-electric text-white hover:bg-blue-700" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"} ${className}`}>
    {children}
  </button>
);

export const Card = forwardRef(({ children, className = "" }, ref) => <div ref={ref} className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>);
Card.displayName = "Card";
export const PageTitle = ({ title, action, subtitle }) => <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h1 className="text-2xl font-semibold text-slate-950">{title}</h1>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>{action}</div>;

export const Field = ({ label, error, children }) => (
  <label className="grid gap-1 text-sm font-medium text-slate-700">
    {label}
    {children}
    {error && <span className="text-xs text-red-600">{error}</span>}
  </label>
);

export const inputClass = "focus-ring w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm";

export const Loading = () => <div className="rounded-lg border bg-white p-8 text-center text-slate-500">Loading...</div>;
export const Empty = ({ text = "No records yet." }) => <div className="rounded-lg border border-dashed bg-white p-8 text-center text-slate-500">{text}</div>;

export const DataTable = ({ rows = [], columns = [], empty = "No data.", pageSize = 8 }) => {
  const [sort, setSort] = useState({ key: columns[0]?.key, direction: "asc" });
  const [page, setPage] = useState(1);
  const sorted = useMemo(() => sort.key ? sortRows(rows, sort.key, sort.direction) : rows, [rows, sort]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);
  if (!rows.length) return <Empty text={empty} />;
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>{columns.map((column) => <th key={column.key} className="px-4 py-3 text-left font-semibold text-slate-600"><button className="inline-flex items-center gap-1" onClick={() => setSort({ key: column.key, direction: sort.direction === "asc" ? "desc" : "asc" })}>{column.label}<ArrowDownUp size={13} /></button></th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pageRows.map((row) => <tr key={row.id} className="hover:bg-blue-50/40">{columns.map((column) => <td key={column.key} className="px-4 py-3 text-slate-700">{column.render ? column.render(row) : row[column.key]}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-slate-500">
        <span>Page {page} of {totalPages}</span>
        <div className="flex gap-2"><Button variant="secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button><Button variant="secondary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button></div>
      </div>
    </div>
  );
};

export const SearchBox = ({ value, onChange, placeholder = "Search" }) => (
  <div className="relative">
    <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={18} />
    <input className={`${inputClass} pl-10`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
  </div>
);
