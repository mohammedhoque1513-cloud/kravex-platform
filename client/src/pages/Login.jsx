import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BrandLockup } from "../components/Brand";
import { Button, Field, inputClass } from "../components/UI";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState({ business: "", name: "", email: "", phone: "", niche: "", location: "" });
  const [error, setError] = useState("");

  if (user) return <Navigate to={user.role === "ADMIN" ? "/dashboard" : "/portal"} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.email || form.password.length < 1) {
      setError("Enter your email and password.");
      return;
    }
    try {
      const loggedIn = await login(form.email, form.password);
      navigate(loggedIn.role === "ADMIN" ? "/dashboard" : "/portal");
    } catch {
      setError("Login failed. Check your details and try again.");
    }
  };

  if (mode === "signup") {
    return (
      <div className="grid min-h-screen place-items-center bg-navy px-4">
        <form onSubmit={(event) => { event.preventDefault(); setError("Client signup will create the portal account once OAuth/SMS auth is connected."); }} className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
          <div className="mb-6">
            <BrandLockup subtitle="Client Portal" />
            <h1 className="mt-5 text-2xl font-semibold">Create KRAVEX account</h1>
            <p className="mt-1 text-sm text-slate-500">Client portal signup</p>
          </div>
          <div className="grid gap-4">
            {[
              ["business", "Business name"],
              ["name", "Your name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["niche", "Industry / niche"],
              ["location", "UK city"]
            ].map(([key, text]) => (
              <Field key={key} label={text}>
                <input className={inputClass} value={signup[key]} onChange={(event) => setSignup({ ...signup, [key]: event.target.value })} />
              </Field>
            ))}
            {error && <p className="rounded bg-blue-50 p-3 text-sm text-blue-700">{error}</p>}
            <Button>Sign Up</Button>
            <Button type="button" variant="secondary" onClick={() => setMode("signin")}>Back to Sign In</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-navy px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-6">
          <BrandLockup subtitle="Lead Generation Operating System" />
          <h1 className="mt-5 text-2xl font-semibold">Sign in to KRAVEX</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in with your email and password.</p>
        </div>
        <div className="grid gap-4">
          <Field label="Email"><input className={inputClass} placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Field>
          <Field label="Password"><input className={inputClass} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></Field>
          {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="h-2" />
          <Button>Sign In</Button>
          <a className="text-center text-sm text-electric" href="/reset-password">Forgot password?</a>
          <p className="text-center text-sm text-slate-500">No account? <button type="button" className="font-semibold text-electric" onClick={() => { setError(""); setMode("signup"); }}>Sign Up</button></p>
        </div>
      </form>
    </div>
  );
}
