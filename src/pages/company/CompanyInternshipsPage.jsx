import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card } from "../../components/ui/index.js";
import { createCompanyInternship, deleteCompanyInternship, getCompanyInternships, updateCompanyInternship } from "../../services/companyService.js";

const EMPTY_FORM = { title: "", description: "", location: "", type: "Onsite", duration: "", salary: "0", skills: "", deadline: "" };
const statusMeta = (item) => item.moderationStatus === "approved" && item.isActive
  ? { label: "Published", variant: "success" }
  : item.moderationStatus === "rejected"
    ? { label: "Rejected", variant: "danger" }
    : { label: "Pending review", variant: "warning" };

export function CompanyInternshipsPage() {
  const [company, setCompany] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const result = await getCompanyInternships();
    setCompany(result.company);
    setItems(result.internships || []);
  };

  useEffect(() => {
    let active = true;
    getCompanyInternships()
      .then((result) => { if (active) { setCompany(result.company); setItems(result.internships || []); } })
      .catch((err) => { if (active) setError(err.message || "Unable to load internships."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const approved = company?.verificationStatus === "approved";
  const visible = useMemo(() => items.filter((item) => {
    const matchesQuery = `${item.title} ${item.location} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase());
    const state = item.moderationStatus || "pending";
    const matchesFilter = filter === "all" || state === filter;
    return matchesQuery && matchesFilter;
  }), [items, query, filter]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFormOpen(true); setError(""); setNotice(""); };
  const openEdit = (item) => {
    setEditing(item);
    setFormOpen(true);
    setForm({
      title: item.title || "", description: item.description || "", location: item.location || "",
      type: item.type || "Onsite", duration: item.duration || "", salary: String(item.salary ?? 0),
      skills: Array.isArray(item.skills) ? item.skills.join(", ") : "", deadline: item.deadline ? new Date(item.deadline).toISOString().slice(0, 10) : "",
    });
    setError(""); setNotice("");
  };
  const closeForm = () => { setEditing(null); setForm(EMPTY_FORM); setFormOpen(false); };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    const payload = {
      ...form,
      salary: Number(form.salary),
      skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
    };
    try {
      if (editing) await updateCompanyInternship(editing._id, payload);
      else await createCompanyInternship(payload);
      await load();
      setNotice(editing ? "Internship updated and sent for administrator review." : "Internship created and sent for administrator review.");
      closeForm();
    } catch (err) { setError(err.message || "Unable to save internship."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This is only possible when no applications have been received.`)) return;
    setError(""); setNotice("");
    try { await deleteCompanyInternship(item._id); await load(); setNotice("Internship deleted."); }
    catch (err) { setError(err.message || "Unable to delete internship."); }
  };

  if (loading) return <p className="p-8 text-sm text-text-secondary">Loading internships…</p>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-text-primary">Manage internships</h1><p className="mt-1 text-sm text-text-secondary">Create and manage your company's internship listings.</p></div>
        <Button onClick={openCreate} disabled={!approved}>Post internship</Button>
      </div>
      {!approved && <div className="rounded-xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-800">Your company must be approved before creating or editing internships. Current status: <strong>{company?.verificationStatus || "profile missing"}</strong>.</div>}
      {error && <p role="alert" className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">{error}</p>}
      {notice && <p role="status" className="rounded-lg bg-success-50 p-3 text-sm text-success-700">{notice}</p>}

      {formOpen ? (
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center justify-between"><h2 className="font-bold text-text-primary">{editing ? "Edit internship" : "New internship"}</h2><button type="button" onClick={closeForm} className="text-sm text-text-muted">Close</button></div>
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-sm text-text-secondary">Title<input required minLength={3} name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-border px-3 text-text-primary" /></label>
            <label className="text-sm text-text-secondary">Location<input name="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-border px-3 text-text-primary" /></label>
            <label className="text-sm text-text-secondary">Work type<select name="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-border px-3 text-text-primary"><option>Onsite</option><option>Remote</option><option>Hybrid</option></select></label>
            <label className="text-sm text-text-secondary">Duration<input name="duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-border px-3 text-text-primary" /></label>
            <label className="text-sm text-text-secondary">Monthly compensation<input type="number" min="0" name="salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-border px-3 text-text-primary" /></label>
            <label className="text-sm text-text-secondary">Application deadline<input type="date" name="deadline" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-border px-3 text-text-primary" /></label>
            <label className="sm:col-span-2 text-sm text-text-secondary">Required skills (comma separated)<input name="skills" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-border px-3 text-text-primary" /></label>
            <label className="sm:col-span-2 text-sm text-text-secondary">Description<textarea required minLength={20} rows={5} name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-lg border border-border p-3 text-text-primary" /></label>
            <div className="sm:col-span-2 flex justify-end gap-2"><Button type="button" variant="outline" onClick={closeForm}>Cancel</Button><Button type="submit" disabled={saving || !approved}>{saving ? "Saving…" : "Save and submit for review"}</Button></div>
          </form>
        </Card>
      ) : null}

      <Card variant="bordered" padding="md" className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3"><input aria-label="Search internships" placeholder="Search title or location…" value={query} onChange={(e) => setQuery(e.target.value)} className="h-10 flex-1 rounded-lg border border-border px-3 text-sm" /><select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 rounded-lg border border-border px-3 text-sm"><option value="all">All statuses</option><option value="pending">Pending review</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></div>
        <div className="divide-y divide-border">
          {visible.map((item) => {
            const meta = statusMeta(item);
            return <article key={item._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
              <div className="min-w-0"><h3 className="font-semibold text-text-primary">{item.title}</h3><p className="mt-1 text-xs text-text-muted">{item.location || "Location not specified"} · {item.type} · {item.applicationsCount || 0} applications</p>{item.moderationReason && <p className="mt-1 text-xs text-danger-600">Admin feedback: {item.moderationReason}</p>}</div>
              <div className="flex items-center gap-2"><Badge variant={meta.variant}>{meta.label}</Badge><Button size="sm" variant="outline" disabled={!approved} onClick={() => openEdit(item)}>Edit</Button><Button size="sm" variant="ghost" onClick={() => handleDelete(item)}>Delete</Button></div>
            </article>;
          })}
          {!visible.length && <p className="py-8 text-center text-sm text-text-muted">No internships match your search.</p>}
        </div>
        <p className="text-xs text-text-muted">{items.length} internship(s) · All new and edited listings require administrator approval before publication.</p>
      </Card>
    </div>
  );
}

export default CompanyInternshipsPage;
