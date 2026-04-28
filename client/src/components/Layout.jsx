import { BarChart3, Building2, CreditCard, FileText, Home, LogOut, Mail, MessageSquare, PieChart, Settings, Target, Users } from "lucide-react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BrandMark } from "./Brand";

const adminLinks = [
  ["/dashboard", Home, "Dashboard"],
  ["/prospects", Target, "Prospects"],
  ["/clients", Building2, "Clients"],
  ["/campaigns", Mail, "Campaigns"],
  ["/leads", Users, "Leads"],
  ["/invoices", FileText, "Invoices"],
  ["/payments", CreditCard, "Payments"],
  ["/reports", BarChart3, "Reports"],
  ["/settings", Settings, "Settings"]
];

const clientLinks = [
  ["/portal", Home, "Portal"],
  ["/portal/leads", Users, "My Leads"],
  ["/portal/invoices", FileText, "Invoices"],
  ["/portal/messages", MessageSquare, "Updates"],
  ["/portal/report", PieChart, "Report"]
];

export const RequireAuth = ({ role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "ADMIN" ? "/dashboard" : "/portal"} replace />;
  return <Outlet />;
};

export const AppLayout = ({ portal = false }) => {
  const { user, logout } = useAuth();
  const links = portal ? clientLinks : adminLinks;
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="bg-navy text-white lg:fixed lg:inset-y-0 lg:w-72">
        <div className="flex h-16 items-center gap-3 px-6">
          <BrandMark className="h-10 w-10" compact />
          <div>
            <div className="font-black tracking-[0.08em]">KRAVEX</div>
            <div className="text-xs text-slate-300">{portal ? user?.client?.businessName : "Agency Console"}</div>
          </div>
        </div>
        <nav className="grid gap-1 px-3 py-4">
          {links.map(([to, Icon, text]) => (
            <NavLink key={to} to={to} end={to === "/" || to === "/portal"} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${isActive ? "bg-blue-600 text-white" : "text-slate-200 hover:bg-slate-800"}`}>
              <Icon size={18} /> {text}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="mx-3 mb-4 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">
          <LogOut size={18} /> Sign out
        </button>
      </aside>
      <main className="min-w-0 flex-1 lg:ml-72">
        <div className="border-b bg-white px-5 py-4 shadow-sm">
          <div className="text-sm text-slate-500">Signed in as {user?.name}</div>
        </div>
        <div className="p-5 lg:p-8"><Outlet /></div>
      </main>
    </div>
  );
};
