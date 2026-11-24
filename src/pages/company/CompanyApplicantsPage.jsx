import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card } from "../../components/ui/index.js";
import { getCompanyApplications, updateCompanyApplicationStatus } from "../../services/companyService.js";

const statusStyle = {
  Pending: { label: "Pending", variant: "warning" },
  Accepted: { label: "Accepted", variant: "success" },
  Rejected: { label: "Rejected", variant: "danger" },
};

export function CompanyApplicantsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    let active = true;
    getCompanyApplications()
      .then((data) => { if (active) setApplications(Array.isArray(data) ? data : []); })
      .catch((err) => { if (active) setError(err.message || "Unable to load applications."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => applications.filter((item) => {
    const student = item.student || {};
    const user = student.user || {};
    const text = `${user.name || ""} ${user.email || ""} ${student.university || ""} ${item.internship?.title || ""}`.toLowerCase();
    return (filter === "all" || item.status === filter) && text.includes(query.trim().toLowerCase());
  }), [applications, filter, query]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id); setError("");
    try {
      const result = await updateCompanyApplicationStatus(id, status);
      const updated = result?._id ? result : result?.data;
      setApplications((current) => current.map((item) => item._id === id ? { ...item, status: updated?.status || status } : item));
    } catch (err) {
      setError(err.message || "Unable to update application status.");
    } finally { setUpdatingId(""); }
  };

  if (loading) return <p className="p-8 text-sm text-text-secondary">Loading applicants…</p>;

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold text-text-primary">Applicants</h1><p className="mt-1 text-sm text-text-secondary">Only candidates who applied to your company's internships appear here.</p></div>
      {error && <p role="alert" className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">{error}</p>}
      <Card variant="bordered" padding="md" className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3"><input aria-label="Search candidates" placeholder="Search candidate, email, university, internship…" value={query} onChange={(e) => setQuery(e.target.value)} className="h-10 flex-1 rounded-lg border border-border px-3 text-sm" /><select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 rounded-lg border border-border px-3 text-sm"><option value="all">All statuses</option><option value="Pending">Pending</option><option value="Accepted">Accepted</option><option value="Rejected">Rejected</option></select></div>
        <div className="divide-y divide-border">
          {filtered.map((application) => {
            const student = application.student || {};
            const candidate = student.user || {};
            const meta = statusStyle[application.status] || statusStyle.Pending;
            return <article key={application._id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <h2 className="font-semibold text-text-primary">{candidate.name || "Candidate"}</h2>
                <p className="text-xs text-text-secondary">{candidate.email || "Email unavailable"}</p>
                <p className="mt-1 text-xs text-text-muted">{student.major || "Major not provided"} · {student.university || "University not provided"}</p>
                <p className="mt-1 text-xs text-text-muted">Applied for: <strong>{application.internship?.title || "Internship"}</strong> · {new Date(application.createdAt).toLocaleDateString()}</p>
                {student.bio && <p className="mt-2 max-w-2xl text-sm text-text-secondary">{student.bio}</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Badge variant={meta.variant}>{meta.label}</Badge>
                <Button size="sm" variant="outline" disabled={updatingId === application._id || application.status === "Accepted"} onClick={() => updateStatus(application._id, "Accepted")}>{updatingId === application._id ? "Saving…" : "Accept"}</Button>
                <Button size="sm" variant="ghost" disabled={updatingId === application._id || application.status === "Rejected"} onClick={() => updateStatus(application._id, "Rejected")}>Reject</Button>
              </div>
            </article>;
          })}
          {!filtered.length && <p className="py-8 text-center text-sm text-text-muted">No applications found.</p>}
        </div>
        <p className="text-xs text-text-muted">{applications.length} application(s) received across your internships.</p>
      </Card>
    </div>
  );
}

export default CompanyApplicantsPage;
