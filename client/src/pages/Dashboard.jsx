import { AlertCircle, Building2, FilePlus2, Mail, Plus, Target, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button, Card, Loading, PageTitle } from "../components/UI";
import { api } from "../utils/api";
import { dateUk, gbp } from "../utils/format";

export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/dashboard").then((res) => setData(res.data)); }, []);
  if (!data) return <Loading />;
  const cards = [
    ["Active clients", data.stats.activeClients, Building2],
    ["MRR", gbp(data.stats.mrr), Target],
    ["Leads this month", data.stats.leadsThisMonth, Users],
    ["Prospects in pipeline", data.stats.prospectsInPipeline, Mail]
  ];
  return (
    <>
      <PageTitle title="Agency Dashboard" subtitle="Track revenue, lead delivery, campaigns, and invoice risk." action={<div className="flex flex-wrap gap-2"><Button><Plus size={16}/> Add Client</Button><Button variant="secondary"><FilePlus2 size={16}/> Create Invoice</Button></div>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon]) => <Card key={label}><Icon className="mb-4 text-electric" /><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></Card>)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card><h2 className="mb-4 font-semibold">Revenue billed</h2><ResponsiveContainer width="100%" height={260}><BarChart data={data.revenueChart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></Card>
        <Card><h2 className="mb-4 font-semibold">Leads delivered</h2><ResponsiveContainer width="100%" height={260}><BarChart data={data.leadChart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Bar dataKey="leads" fill="#0f172a" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></Card>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card><h2 className="mb-3 font-semibold">Campaign health</h2><div className="grid gap-3 sm:grid-cols-3"><p><span className="text-2xl font-semibold">{data.campaignHealth.openRate.toFixed(1)}%</span><br/><span className="text-sm text-slate-500">Avg open rate</span></p><p><span className="text-2xl font-semibold">{data.campaignHealth.replyRate.toFixed(1)}%</span><br/><span className="text-sm text-slate-500">Avg reply rate</span></p><p><span className="text-2xl font-semibold">{data.campaignHealth.activeCampaigns}</span><br/><span className="text-sm text-slate-500">Active campaigns</span></p></div></Card>
        <Card><h2 className="mb-3 flex items-center gap-2 font-semibold"><AlertCircle size={18} className="text-amber-500" /> Upcoming invoices</h2><div className="grid gap-2">{data.upcomingInvoices.map((invoice) => <div key={invoice.id} className="flex justify-between rounded border p-3 text-sm"><span>{invoice.client.businessName}</span><span>{dateUk(invoice.dueDate)} · {invoice.status}</span></div>)}</div></Card>
      </div>
    </>
  );
}
