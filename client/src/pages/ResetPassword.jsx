import { useState } from "react";
import { api } from "../utils/api";
import { Button, Card, Field, inputClass } from "../components/UI";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/auth/password-reset/request", { email });
    setMessage(data.resetToken ? `Reset token generated for dev use: ${data.resetToken}` : data.message);
  };
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <h1 className="mb-4 text-xl font-semibold">Password reset</h1>
        <form onSubmit={submit} className="grid gap-4">
          <Field label="Account email"><input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Button>Generate reset link</Button>
          {message && <p className="rounded bg-blue-50 p-3 text-sm text-blue-700 break-words">{message}</p>}
        </form>
      </Card>
    </div>
  );
}
