"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/shared/ui";

type SecurityEvent = {
  id?: string;
  type: string;
  severity?: string;
  description: string;
  ipAddress?: string;
  createdAt?: string;
};

export function SecurityEventsPanel() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/security/events")
      .then((res) => res.json())
      .then((body) => setEvents(body.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <div className="flex items-center gap-3 text-kravex-gold">
        <AlertTriangle size={20} />
        <h2 className="font-heading text-3xl text-white">Recent security events</h2>
      </div>
      <div className="mt-6 space-y-3">
        {loading ? <p className="text-sm text-kravex-secondary">Loading security events...</p> : null}
        {!loading && !events.length ? <p className="rounded border border-kravex-border bg-black p-4 text-sm text-kravex-secondary">No security events recorded yet.</p> : null}
        {events.map((event, index) => (
          <div key={event.id || index} className="rounded border border-kravex-border bg-black p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold">{event.type}</p>
              <span className="rounded bg-white/5 px-2 py-1 text-xs font-bold uppercase text-kravex-secondary">{event.severity || "LOW"}</span>
            </div>
            <p className="mt-2 text-sm text-kravex-secondary">{event.description}</p>
            <p className="mt-2 text-xs text-kravex-muted">{event.ipAddress || "No IP"} {event.createdAt ? `- ${new Date(event.createdAt).toLocaleString("en-GB")}` : ""}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
