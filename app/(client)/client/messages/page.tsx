"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/shared/ui";

type Msg = { id: string; sender: "KRAVEX" | "You"; content: string; createdAt: string; read: boolean };

export default function ClientMessages() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [content, setContent] = useState("");

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) return;
    const message: Msg = { id: crypto.randomUUID(), sender: "You", content: content.trim(), createdAt: new Date().toLocaleString("en-GB"), read: true };
    setMessages((current) => [message, ...current]);
    setContent("");
    const response = await fetch("/api/client/messages", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content: message.content }) });
    if (response.ok) toast.success("Message sent"); else toast.error("Message saved locally, but the API needs a signed-in client session.");
  }

  return (
    <div className="space-y-8">
      <div><p className="text-xs font-bold uppercase tracking-[.3em] text-kravex-gold">Client Dashboard</p><h1 className="mt-3 font-heading text-5xl">Messages</h1><p className="mt-3 text-kravex-secondary">Keep every KRAVEX update and reply in one place.</p></div>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <h2 className="font-heading text-2xl">Thread</h2>
          <div className="mt-5 space-y-4">
            {messages.length ? messages.map((message) => <div key={message.id} className={`rounded border p-4 ${message.sender === "You" ? "border-kravex-gold/40 bg-kravex-gold/10" : "border-kravex-border bg-black"}`}><div className="flex items-center justify-between gap-3"><p className="font-bold">{message.sender}</p><p className="text-xs text-kravex-muted">{message.createdAt}</p></div><p className="mt-2 text-sm leading-6 text-kravex-secondary">{message.content}</p><p className="mt-2 text-xs text-kravex-muted">{message.read ? "Read" : "Unread"}</p></div>) : <div className="rounded border border-dashed border-kravex-border bg-black p-8 text-center"><p className="font-heading text-3xl">No messages yet</p><p className="mx-auto mt-3 max-w-xl text-kravex-secondary">When KRAVEX sends an update, invoice note or lead clarification, it will appear here.</p></div>}
          </div>
        </Card>
        <Card className="h-fit">
          <h2 className="font-heading text-2xl">Reply</h2>
          <form onSubmit={send} className="mt-5 grid gap-4">
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your message to KRAVEX" className="min-h-40 rounded border border-kravex-border bg-black px-4 py-3 text-white gold-focus" />
            <button className="inline-flex items-center justify-center gap-2 rounded bg-kravex-gold px-5 py-3 font-bold text-black"><Send size={18} />Send message</button>
          </form>
        </Card>
      </div>
    </div>
  );
}
