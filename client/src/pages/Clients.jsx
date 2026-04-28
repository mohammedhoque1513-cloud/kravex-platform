import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, DataTable, Field, inputClass, PageTitle, SearchBox } from "../components/UI";
import { api } from "../utils/api";
import { dateUk, gbp, label } from "../utils/format";

const blank = { businessName: "", contactName: "", email: "", phone: "", niche: "Dentists", location: "", website: "", retainerAmount: 1500, leadTarget: 20, status: "ACTIVE", contractStart: new Date().toISOString().slice(0, 10), portalPassword: "Password123!" };

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const load = () => api.get("/clients", { params: { search } }).then((res) => setClients(res.data));
  useEffect(() => { load(); }, []);
  const save = async (event) => {
    event.preventDefault();
    if (editing.id) await api.put(`/clients/${editing.id}`, editing);
    else await api.post("/clients", editing);
    setEditing(null); load();
  };
  return (
    <>
      <PageTitle title="Clients" subtitle="Manage active, paused, churned, and archived accounts." action={<Button onClick={() => setEditing(blank)}><Plus size={16}/> Add Client</Button>} />
      <div className="mb-4 max-w-sm"><SearchBox value={search} onChange={setSearch} placeholder="Search clients" /></div>
      <DataTable rows={clients.filter((c) => c.businessName.toLowerCase().includes(search.toLowerCase()))} columns={[
        { key: "businessName", label: "Business", render: (row) => <Link className="font-medium text-electric" to={`/clients/${row.id}`}>{row.businessName}</Link> },
        { key: "contactName", label: "Contact" },
        { key: "niche", label: "Niche" },
        { key: "retainerAmount", label: "Retainer", render: (row) => gbp(row.retainerAmount) },
        { key: "leadTarget", label: "Target" },
        { key: "status", label: "Status", render: (row) => label(row.status) },
        { key: "contractStart", label: "Start", render: (row) => dateUk(row.contractStart) }
      ]} />
      {editing && <ClientModal client={editing} setClient={setEditing} onSave={save} onClose={() => setEditing(null)} />}
    </>
  );
}

export function ClientModal({ client, setClient, onSave, onClose }) {
  const set = (key, value) => setClient({ ...client, [key]: value });
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><form onSubmit={onSave} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl"><h2 className="mb-4 text-xl font-semibold">{client.id ? "Edit Client" : "Add Client"}</h2><div className="grid gap-4 md:grid-cols-2">{["businessName", "contactName", "email", "phone", "niche", "location", "website"].map((key) => <Field key={key} label={label(key)}><input className={inputClass} required={["businessName", "contactName", "email"].includes(key)} value={client[key] || ""} onChange={(e) => set(key, e.target.value)} /></Field>)}<Field label="Retainer amount"><input className={inputClass} type="number" value={client.retainerAmount || 0} onChange={(e) => set("retainerAmount", e.target.value)} /></Field><Field label="Lead target"><input className={inputClass} type="number" value={client.leadTarget || 0} onChange={(e) => set("leadTarget", e.target.value)} /></Field><Field label="Status"><select className={inputClass} value={client.status || "ACTIVE"} onChange={(e) => set("status", e.target.value)}>{["ACTIVE", "PAUSED", "CHURNED", "ARCHIVED"].map((s) => <option key={s} value={s}>{label(s)}</option>)}</select></Field><Field label="Contract start"><input className={inputClass} type="date" value={String(client.contractStart || "").slice(0, 10)} onChange={(e) => set("contractStart", e.target.value)} /></Field>{!client.id && <Field label="Client portal password"><input className={inputClass} value={client.portalPassword || ""} onChange={(e) => set("portalPassword", e.target.value)} /></Field>}</div><div className="mt-6 flex justify-end gap-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button>Save</Button></div></form></div>;
}
