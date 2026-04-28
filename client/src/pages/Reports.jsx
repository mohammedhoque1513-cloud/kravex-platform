import { useEffect, useState } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, Loading, PageTitle } from "../components/UI";
import { api } from "../utils/api";
import { gbp, label } from "../utils/format";

const colors = ["#3b82f6", "#0f172a", "#22c55e", "#f59e0b"];
export default function Reports() {
  const [agency, setAgency] = useState(null);
  useEffect(() => { api.get("/reports/agency").then((res) => setAgency(res.data)); }, []);
  if (!agency) return <Loading />;
  const statusData = Object.entries(agency.clientStatusSummary).map(([name, value]) => ({ name: label(name), value }));
  return <><PageTitle title="Reporting" subtitle="Agency-wide monthly performance and client status summary." /><div className="grid gap-4 md:grid-cols-3"><Card><p className="text-sm text-slate-500">Total MRR</p><p className="text-2xl font-semibold">{gbp(agency.totalMrr)}</p></Card><Card><p className="text-sm text-slate-500">Leads delivered</p><p className="text-2xl font-semibold">{agency.totalLeadsDelivered}</p></Card><Card><p className="text-sm text-slate-500">Revenue billed</p><p className="text-2xl font-semibold">{gbp(agency.revenueBilled)}</p></Card></div><div className="mt-6 grid gap-6 xl:grid-cols-2"><Card><h2 className="mb-4 font-semibold">Top campaigns</h2><ResponsiveContainer height={280}><BarChart data={agency.topCampaigns}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" hide /><YAxis /><Tooltip /><Bar dataKey="callsBooked" fill="#3b82f6" /></BarChart></ResponsiveContainer></Card><Card><h2 className="mb-4 font-semibold">Client status</h2><ResponsiveContainer height={280}><PieChart><Pie data={statusData} dataKey="value" nameKey="name" outerRadius={95}>{statusData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></Card></div></>;
}
