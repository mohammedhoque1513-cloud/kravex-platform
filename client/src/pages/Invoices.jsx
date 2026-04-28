import { FileDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, DataTable, Field, inputClass, PageTitle } from "../components/UI";
import { api } from "../utils/api";
import { dateUk, gbp, label } from "../utils/format";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]), [clients, setClients] = useState([]), [editing, setEditing] = useState(null);
  const load = () => api.get("/invoices").then((res) => setInvoices(res.data));
  useEffect(() => { load(); api.get("/clients").then((res) => setClients(res.data)); }, []);
  const save = async (e) => { e.preventDefault(); await api.post("/invoices", editing); setEditing(null); load(); };
  const blank = { clientId: clients[0]?.id || "", dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), description: "Lead Generation Retainer", amount: 1500, vatEnabled: true, status: "SENT" };
  const downloadPdf = async (invoice) => {
    const { data } = await api.get(`/invoices/${invoice.id}/pdf`, { responseType: "blob" });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.invoiceNumber}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return <><PageTitle title="Invoices" subtitle="Create UK VAT invoices, track status, and export branded PDFs." action={<Button onClick={() => setEditing(blank)}><Plus size={16}/> Create Invoice</Button>} /><DataTable rows={invoices} columns={[{ key: "invoiceNumber", label: "Number" }, { key: "client", label: "Client", render: (r) => r.client?.businessName }, { key: "total", label: "Total", render: (r) => gbp(r.total) }, { key: "status", label: "Status", render: (r) => <select className="rounded border px-2 py-1" value={r.status} onChange={async (e) => { await api.put(`/invoices/${r.id}`, { status: e.target.value }); load(); }}>{["DRAFT", "SENT", "PAID", "OVERDUE"].map((s) => <option key={s} value={s}>{label(s)}</option>)}</select> }, { key: "dueDate", label: "Due", render: (r) => dateUk(r.dueDate) }, { key: "pdf", label: "PDF", render: (r) => <button className="inline-flex text-electric" onClick={() => downloadPdf(r)}><FileDown size={18}/></button> }]} />{editing && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><form onSubmit={save} className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"><h2 className="mb-4 text-xl font-semibold">Create Invoice</h2><div className="grid gap-4 md:grid-cols-2"><Field label="Client"><select className={inputClass} value={editing.clientId} onChange={(e) => setEditing({ ...editing, clientId: e.target.value })}>{clients.map((c) => <option key={c.id} value={c.id}>{c.businessName}</option>)}</select></Field><Field label="Due date"><input className={inputClass} type="date" value={editing.dueDate} onChange={(e) => setEditing({ ...editing, dueDate: e.target.value })} /></Field><Field label="Line item"><input className={inputClass} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field><Field label="Amount"><input className={inputClass} type="number" value={editing.amount} onChange={(e) => setEditing({ ...editing, amount: e.target.value })} /></Field><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.vatEnabled} onChange={(e) => setEditing({ ...editing, vatEnabled: e.target.checked })} /> Add UK VAT at 20%</label></div><div className="mt-6 flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button>Save</Button></div></form></div>}</>;
}
