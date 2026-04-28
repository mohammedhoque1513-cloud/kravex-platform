import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, DataTable, Loading, PageTitle, inputClass } from "../components/UI";
import { api } from "../utils/api";
import { dateUk, gbp, label } from "../utils/format";

export default function ClientProfile() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState("");
  const load = () => api.get(`/clients/${id}`).then((res) => setClient(res.data));
  useEffect(() => { load(); }, [id]);
  if (!client) return <Loading />;
  return <>
    <PageTitle title={client.businessName} subtitle={`${client.niche} · ${client.location} · ${label(client.status)}`} />
    <div className="grid gap-4 md:grid-cols-4">
      <Card><p className="text-sm text-slate-500">Retainer</p><p className="text-2xl font-semibold">{gbp(client.retainerAmount)}</p></Card>
      <Card><p className="text-sm text-slate-500">Monthly target</p><p className="text-2xl font-semibold">{client.leadTarget}</p></Card>
      <Card><p className="text-sm text-slate-500">Contract start</p><p className="text-2xl font-semibold">{dateUk(client.contractStart)}</p></Card>
      <Card><p className="text-sm text-slate-500">Portal users</p><p className="text-2xl font-semibold">{client.users.length}</p></Card>
    </div>
    <div className="mt-6"><h2 className="mb-3 font-semibold">Recent leads</h2><DataTable rows={client.leads} columns={[{ key: "leadName", label: "Lead" }, { key: "businessName", label: "Business" }, { key: "quality", label: "Quality", render: (r) => label(r.quality) }, { key: "status", label: "Status", render: (r) => label(r.status) }, { key: "deliveredAt", label: "Delivered", render: (r) => dateUk(r.deliveredAt) }]} /></div>
    <div className="mt-6"><h2 className="mb-3 font-semibold">Invoices</h2><DataTable rows={client.invoices} columns={[{ key: "invoiceNumber", label: "Number" }, { key: "total", label: "Total", render: (r) => gbp(r.total) }, { key: "status", label: "Status", render: (r) => label(r.status) }, { key: "dueDate", label: "Due", render: (r) => dateUk(r.dueDate) }]} /></div>
    <Card className="mt-6"><h2 className="mb-3 font-semibold">Client portal updates</h2><form className="flex flex-col gap-3 md:flex-row" onSubmit={async (e) => { e.preventDefault(); await api.post("/messages", { clientId: client.id, content: message }); setMessage(""); load(); }}><input className={inputClass} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Leave an update for the client portal" /><Button>Post update</Button></form><div className="mt-4 grid gap-2">{client.messages.map((item) => <p key={item.id} className="rounded bg-slate-50 p-3 text-sm">{item.content}</p>)}</div></Card>
  </>;
}
