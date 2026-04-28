import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useAuth } from "../context/AuthContext";
import { Card, DataTable, Loading, PageTitle } from "../components/UI";
import { api } from "../utils/api";
import { dateUk, gbp, label } from "../utils/format";

const colors = { HOT: "#22c55e", WARM: "#3b82f6", COLD: "#f59e0b" };
export default function Portal() {
  const { user } = useAuth();
  const [client, setClient] = useState(null), [summary, setSummary] = useState(null);
  useEffect(() => { api.get(`/clients/${user.clientId}`).then((res) => setClient(res.data)); api.get(`/leads/client/${user.clientId}/summary`).then((res) => setSummary(res.data)); }, [user.clientId]);
  if (!client || !summary) return <Loading />;
  const quality = Object.entries(summary.quality).map(([name, value]) => ({ name, value }));
  const currentInvoice = client.invoices?.[0];
  return <><PageTitle title={`Welcome, ${client.businessName}`} subtitle="Your lead delivery, invoice status, and agency updates." /><div className="grid gap-4 md:grid-cols-3"><Card><p className="text-sm text-slate-500">Leads this month</p><p className="text-2xl font-semibold">{summary.delivered} / {summary.target}</p></Card><Card><p className="text-sm text-slate-500">Current invoice</p><p className="text-2xl font-semibold">{currentInvoice ? label(currentInvoice.status) : "None"}</p></Card><Card><p className="text-sm text-slate-500">Retainer</p><p className="text-2xl font-semibold">{gbp(client.retainerAmount)}</p></Card></div><div className="mt-6 grid gap-6 xl:grid-cols-2"><Card><h2 className="mb-3 font-semibold">Lead quality</h2><ResponsiveContainer height={240}><PieChart><Pie data={quality} dataKey="value" nameKey="name" outerRadius={85}>{quality.map((q) => <Cell key={q.name} fill={colors[q.name]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></Card><Card><h2 className="mb-3 font-semibold">Updates</h2><div className="grid gap-2">{client.messages.map((message) => <p key={message.id} className="rounded bg-slate-50 p-3 text-sm">{message.content}</p>)}</div></Card></div><div className="mt-6"><h2 className="mb-3 font-semibold">Your leads</h2><DataTable rows={client.leads} columns={[{ key: "leadName", label: "Lead" }, { key: "businessName", label: "Business" }, { key: "email", label: "Email" }, { key: "phone", label: "Phone" }, { key: "source", label: "Source", render: (r) => label(r.source) }, { key: "quality", label: "Quality", render: (r) => label(r.quality) }, { key: "status", label: "Status", render: (r) => label(r.status) }, { key: "deliveredAt", label: "Delivered", render: (r) => dateUk(r.deliveredAt) }]} /></div></>;
}
