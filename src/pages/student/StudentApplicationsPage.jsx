import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card } from "../../components/ui/index.js";
import { ROUTES } from "../../constants/routes.js";
import { getMyApplications, withdrawMyApplication } from "../../services/applicationService.js";

const STATUS_META = {
  Pending: { label: "Pending", variant: "warning" },
  Accepted: { label: "Accepted", variant: "success" },
  Rejected: { label: "Rejected", variant: "danger" },
};

export function StudentApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawingId, setWithdrawingId] = useState("");

  useEffect(() => {
    let active = true;
    getMyApplications()
      .then((data) => { if (active) setApplications(Array.isArray(data) ? data : []); })
      .catch((err) => { if (active) setError(err.message || "Unable to load your applications."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const counts = useMemo(() => applications.reduce((result, item) => {
    const status = item.status || "Pending";
    result[status] = (result[status] || 0) + 1;
    return result;
  }, { Pending: 0, Accepted: 0, Rejected: 0 }), [applications]);

  const filtered = applications.filter((item) => filter === "all" || item.status === filter);

  const withdraw = async (application) => {
    if (!window.confirm("Withdraw this pending application?")) return;
    setWithdrawingId(application._id); setError("");
    try {
      await withdrawMyApplication(application._id);
      setApplications((current) => current.filter((item) => item._id !== application._id));
    } catch (err) { setError(err.message || "Unable to withdraw this application."); }
    finally { setWithdrawingId(""); }
  };

  if (loading) return <p className="py-10 text-center text-sm text-text-secondary">Loading your applications…</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div><h1 className="text-2xl font-bold text-text-primary sm:text-3xl">My applications</h1><p className="mt-1 text-sm text-text-secondary">Track the decisions companies make on your applications.</p></div>
        <Badge variant="primary">{applications.length} total</Badge>
      </div>
      {error && <p role="alert" className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">{error}</p>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Object.entries(counts).map(([status, count]) => <Card key={status} padding="md"><p className="text-xs text-text-muted">{status}</p><p className="mt-1 text-2xl font-bold text-text-primary">{count}</p></Card>)}
      </div>
      <Card padding="md" className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {[["all","All"],["Pending","Pending"],["Accepted","Accepted"],["Rejected","Rejected"]].map(([value,label]) => <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${filter === value ? "border-primary-500 bg-primary-50 text-primary-700" : "border-border text-text-secondary hover:bg-secondary-50"}`}>{label}</button>)}
        </div>
        {filtered.length ? <div className="divide-y divide-border">
          {filtered.map((application) => {
            const internship = application.internship || {};
            const company = internship.company || {};
            const meta = STATUS_META[application.status] || STATUS_META.Pending;
            return <article key={application._id} className="flex flex-col justify-between gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
              <div className="min-w-0"><h2 className="font-semibold text-text-primary">{internship.title || "Internship"}</h2><p className="mt-1 text-xs text-text-secondary">{company.companyName || company.user?.name || "Company"} · {internship.location || "Location not specified"}</p><p className="mt-1 text-[11px] text-text-muted">Applied {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : "recently"}</p></div>
              <div className="flex flex-wrap items-center gap-2"><Badge variant={meta.variant}>{meta.label}</Badge>{internship._id && <Link className="text-xs font-semibold text-primary-600" to={ROUTES.STUDENT_INTERNSHIP_DETAILS.replace(":id", internship._id)}>View role</Link>}{application.status === "Pending" && <Button size="sm" variant="outline" disabled={withdrawingId === application._id} onClick={() => withdraw(application)}>{withdrawingId === application._id ? "Withdrawing…" : "Withdraw"}</Button>}</div>
            </article>;
          })}
        </div> : <div className="py-10 text-center"><h2 className="font-semibold text-text-primary">No applications found</h2><p className="mt-1 text-sm text-text-secondary">Explore internships and submit your first application.</p><Link to={ROUTES.STUDENT_INTERNSHIPS}><Button className="mt-4">Browse internships</Button></Link></div>}
      </Card>
    </div>
  );
}

export default StudentApplicationsPage;
