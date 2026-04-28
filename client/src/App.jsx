import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout, RequireAuth } from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import Campaigns from "./pages/Campaigns";
import ClientProfile from "./pages/ClientProfile";
import Clients from "./pages/Clients";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Leads from "./pages/Leads";
import Login from "./pages/Login";
import Payments from "./pages/Payments";
import Portal from "./pages/Portal";
import Policies from "./pages/Policies";
import Prospects from "./pages/Prospects";
import PublicHome from "./pages/PublicHome";
import Reports from "./pages/Reports";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";

function RootPage() {
  const { user } = useAuth();
  if (!user) return <PublicHome />;
  return <Navigate to={user.role === "CLIENT" ? "/portal" : "/dashboard"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootPage />} />
      <Route path="/policies" element={<Policies />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<RequireAuth role="ADMIN" />}>
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="prospects" element={<Prospects />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientProfile />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="leads" element={<Leads />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
      <Route element={<RequireAuth role="CLIENT" />}>
        <Route element={<AppLayout portal />}>
          <Route path="portal" element={<Portal />} />
          <Route path="portal/leads" element={<Portal />} />
          <Route path="portal/invoices" element={<Portal />} />
          <Route path="portal/messages" element={<Portal />} />
          <Route path="portal/report" element={<Portal />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
