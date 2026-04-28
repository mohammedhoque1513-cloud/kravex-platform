import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Field, inputClass, PageTitle } from "../components/UI";
import { api } from "../utils/api";
import { gbp, label } from "../utils/format";

const stages = ["NEW_LEAD", "CONTACTED", "CALL_BOOKED", "PROPOSAL_SENT", "NEGOTIATING", "CLOSED_WON", "CLOSED_LOST"];
const blank = { businessName: "", contactName: "", email: "", phone: "", niche: "Dentists", location: "", website: "", linkedin: "", estimatedValue: 1000, notes: "" };

export default function Prospects() {
  const [prospects, setProspects] = useState([]);
  const [filters, setFilters] = useState({ niche: "", stage: "", location: "" });
  const [editing, setEditing] = useState(null);
  const load = () => api.get("/prospects", { params: filters }).then((res) => setProspects(res.data));
  useEffect(() => { load(); }, [filters.stage]);
  const grouped = useMemo(() => Object.fromEntries(stages.map((stage) => [stage, prospects.filter((p) => p.stage === stage)])), [prospects]);

  const save = async (event) => {
    event.preventDefault();
    if (editing.id) await api.put(`/prospects/${editing.id}`, editing);
    else await api.post("/prospects", editing);
    setEditing(null);
    load();
  };

  const onDragEnd = async ({ destination, draggableId }) => {
    if (!destination) return;
    await api.put(`/prospects/${draggableId}`, { stage: destination.droppableId });
    setProspects((items) => items.map((item) => item.id === draggableId ? { ...item, stage: destination.droppableId } : item));
  };

  return (
    <>
      <PageTitle title="Prospect Pipeline" subtitle="Move prospects through the sales process and convert wins into clients." action={<Button onClick={() => setEditing(blank)}><Plus size={16}/> Add Prospect</Button>} />
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <input className={inputClass} placeholder="Filter niche" value={filters.niche} onChange={(e) => setFilters({ ...filters, niche: e.target.value })} onBlur={load} />
        <select className={inputClass} value={filters.stage} onChange={(e) => setFilters({ ...filters, stage: e.target.value })}><option value="">All stages</option>{stages.map((stage) => <option key={stage} value={stage}>{label(stage)}</option>)}</select>
        <input className={inputClass} placeholder="Filter location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} onBlur={load} />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-4 overflow-x-auto xl:grid-cols-7">
          {stages.map((stage) => (
            <Droppable droppableId={stage} key={stage}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-96 rounded-lg bg-slate-100 p-3">
                  <h2 className="mb-3 text-sm font-semibold text-slate-600">{label(stage)} ({grouped[stage]?.length || 0})</h2>
                  <div className="grid gap-3">
                    {grouped[stage]?.map((prospect, index) => (
                      <Draggable draggableId={prospect.id} index={index} key={prospect.id}>
                        {(drag) => (
                          <Card className="cursor-grab p-4" ref={drag.innerRef} {...drag.draggableProps} {...drag.dragHandleProps}>
                            <button className="text-left font-semibold text-slate-900" onClick={() => setEditing(prospect)}>{prospect.businessName}</button>
                            <p className="text-sm text-slate-500">{prospect.contactName} · {prospect.location}</p>
                            <p className="mt-2 text-sm font-medium">{gbp(prospect.estimatedValue)}</p>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      {editing && <ProspectModal prospect={editing} setProspect={setEditing} onSave={save} onClose={() => setEditing(null)} onConvert={async () => { await api.post(`/prospects/${editing.id}/convert`, { retainerAmount: editing.estimatedValue, leadTarget: 20 }); setEditing(null); load(); }} />}
    </>
  );
}

function ProspectModal({ prospect, setProspect, onSave, onClose, onConvert }) {
  const set = (key, value) => setProspect({ ...prospect, [key]: value });
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
      <form onSubmit={onSave} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">{prospect.id ? "Edit Prospect" : "Add Prospect"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {["businessName", "contactName", "email", "phone", "niche", "location", "website", "linkedin"].map((key) => <Field key={key} label={label(key)}><input required={["businessName", "contactName", "email"].includes(key)} className={inputClass} value={prospect[key] || ""} onChange={(e) => set(key, e.target.value)} /></Field>)}
          <Field label="Estimated monthly value"><input className={inputClass} type="number" value={prospect.estimatedValue || 0} onChange={(e) => set("estimatedValue", e.target.value)} /></Field>
          <Field label="Stage"><select className={inputClass} value={prospect.stage || "NEW_LEAD"} onChange={(e) => set("stage", e.target.value)}>{stages.map((stage) => <option key={stage} value={stage}>{label(stage)}</option>)}</select></Field>
          <Field label="Notes"><textarea className={inputClass} rows="3" value={prospect.notes || ""} onChange={(e) => set("notes", e.target.value)} /></Field>
        </div>
        {prospect.activities?.length > 0 && <div className="mt-5"><h3 className="font-semibold">Activity log</h3><div className="mt-2 grid gap-2">{prospect.activities.map((activity) => <p key={activity.id} className="rounded bg-slate-50 p-3 text-sm">{label(activity.type)}: {activity.note}</p>)}</div></div>}
        <div className="mt-6 flex flex-wrap justify-between gap-2"><div>{prospect.id && <Button type="button" variant="secondary" onClick={onConvert}>Convert to client</Button>}</div><div className="flex gap-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button>Save</Button></div></div>
      </form>
    </div>
  );
}
