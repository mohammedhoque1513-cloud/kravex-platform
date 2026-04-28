import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, DataTable, Field, PageTitle, inputClass } from "../components/UI";
import { api } from "../utils/api";
import { dateUk, gbp, label } from "../utils/format";

export default function Payments() {
  const [data, setData] = useState(null);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [paymentsRes, clientsRes, invoicesRes] = await Promise.all([
      api.get("/payments"),
      api.get("/clients"),
      api.get("/invoices")
    ]);
    setData(paymentsRes.data);
    setClients(clientsRes.data);
    setInvoices(invoicesRes.data);
  };

  useEffect(() => { load(); }, []);

  const blank = useMemo(() => ({
    clientId: clients[0]?.id || "",
    invoiceId: "",
    method: "Bank Transfer",
    amount: "",
    reference: "",
    notes: "",
    status: "RECEIVED",
    receivedAt: new Date().toISOString().slice(0, 10)
  }), [clients]);

  const save = async (event) => {
    event.preventDefault();
    await api.post("/payments", editing);
    setEditing(null);
    load();
  };

  if (!data) return null;

  return (
    <>
      <PageTitle
        title="Payments"
        subtitle="Record client payments, track what has been received, and see what is still outstanding."
        action={<Button onClick={() => setEditing(blank)}><Plus size={16} /> Record Payment</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Received</p><p className="mt-2 text-2xl font-semibold">{gbp(data.summary.received)}</p></Card>
        <Card><p className="text-sm text-slate-500">Outstanding</p><p className="mt-2 text-2xl font-semibold">{gbp(data.summary.outstanding)}</p></Card>
        <Card><p className="text-sm text-slate-500">Payments logged</p><p className="mt-2 text-2xl font-semibold">{data.summary.paymentCount}</p></Card>
        <Card><p className="text-sm text-slate-500">Overdue invoices</p><p className="mt-2 text-2xl font-semibold">{data.summary.overdueInvoices}</p></Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DataTable
          rows={data.payments}
          empty="No payments recorded yet."
          columns={[
            { key: "client", label: "Client", render: (row) => row.client?.businessName || "-" },
            { key: "amount", label: "Amount", render: (row) => gbp(row.amount) },
            { key: "method", label: "Method" },
            { key: "status", label: "Status", render: (row) => label(row.status) },
            { key: "reference", label: "Reference", render: (row) => row.reference || "-" },
            { key: "receivedAt", label: "Received", render: (row) => dateUk(row.receivedAt) }
          ]}
        />

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Invoice readiness</h2>
          <div className="grid gap-3">
            {invoices.slice(0, 6).map((invoice) => (
              <div key={invoice.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{invoice.client?.businessName}</div>
                    <div className="mt-1 text-sm text-slate-500">{invoice.invoiceNumber} · Due {dateUk(invoice.dueDate)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{gbp(invoice.total)}</div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">{label(invoice.status)}</div>
                  </div>
                </div>
              </div>
            ))}
            {!invoices.length && <p className="text-sm text-slate-500">No invoices available yet.</p>}
          </div>
        </Card>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
          <form onSubmit={save} className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold">Record Payment</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Client">
                <select className={inputClass} value={editing.clientId} onChange={(e) => setEditing({ ...editing, clientId: e.target.value, invoiceId: "" })}>
                  {clients.map((client) => <option key={client.id} value={client.id}>{client.businessName}</option>)}
                </select>
              </Field>
              <Field label="Invoice">
                <select className={inputClass} value={editing.invoiceId} onChange={(e) => {
                  const invoice = invoices.find((item) => item.id === e.target.value);
                  setEditing({ ...editing, invoiceId: e.target.value, amount: invoice ? Number(invoice.total) : editing.amount });
                }}>
                  <option value="">Not linked to an invoice</option>
                  {invoices.filter((invoice) => invoice.clientId === editing.clientId).map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>{invoice.invoiceNumber} · {gbp(invoice.total)}</option>
                  ))}
                </select>
              </Field>
              <Field label="Method">
                <select className={inputClass} value={editing.method} onChange={(e) => setEditing({ ...editing, method: e.target.value })}>
                  {["Bank Transfer", "Stripe", "GoCardless", "Card Payment", "Cash"].map((method) => <option key={method} value={method}>{method}</option>)}
                </select>
              </Field>
              <Field label="Amount">
                <input className={inputClass} type="number" step="0.01" value={editing.amount} onChange={(e) => setEditing({ ...editing, amount: e.target.value })} />
              </Field>
              <Field label="Reference">
                <input className={inputClass} value={editing.reference} onChange={(e) => setEditing({ ...editing, reference: e.target.value })} />
              </Field>
              <Field label="Received date">
                <input className={inputClass} type="date" value={editing.receivedAt} onChange={(e) => setEditing({ ...editing, receivedAt: e.target.value })} />
              </Field>
              <Field label="Status">
                <select className={inputClass} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                  {["RECEIVED", "PENDING", "FAILED"].map((status) => <option key={status} value={status}>{label(status)}</option>)}
                </select>
              </Field>
              <Field label="Notes">
                <textarea className={inputClass} value={editing.notes} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button>Save Payment</Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
