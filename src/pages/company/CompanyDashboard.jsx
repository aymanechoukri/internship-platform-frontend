import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Card } from "../../components/ui/index.js";
import { ROUTES } from "../../constants/routes.js";
import useAuth from "../../hooks/useAuth.js";
import { getCompanyDashboard } from "../../services/companyService.js";

const number = (value) => Number(value || 0).toLocaleString();

export function CompanyDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getCompanyDashboard()
      .then((data) => { if (active) setDashboard(data); })
      .catch((err) => { if (active) setError(err.message || "Unable to load company dashboard."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) return <p className="p-8 text-sm text-text-secondary">Loading company dashboard…</p>;
  if (error) return <div role="alert" className="rounded-xl border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700">{error}</div>;

  const company = dashboard?.company;
  const stats = dashboard?.summary ?? {};
  const status = company?.verificationStatus ?? "pending";
  const statusVariant = status === "approved" ? "success" : status === "rejected" ? "danger" : "warning";

  const metrics = [
    ["Internships", stats.totalInternships],
    ["Active listings", stats.activeInternships],
    ["Applications", stats.totalApplications],
    ["Pending review", stats.pendingApplications],
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-6">
        <div>
          <p className="text-xs text-text-muted">Company workspace</p>
          <h2 className="mt-1 text-2xl font-bold text-text-primary">Welcome, {user?.name || "Recruiter"}</h2>
          <p className="mt-1 text-sm text-text-secondary">{company?.companyName || "Complete your company profile to get started."}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-text-secondary">Verification:</span>
            <Badge variant={statusVariant} dot>{status}</Badge>
          </div>
          {status === "rejected" && company?.rejectionReason && (
            <p className="mt-2 text-sm text-danger-600">Reason: {company.rejectionReason}</p>
          )}
          {status === "pending" && <p className="mt-2 text-xs text-text-secondary">Your company profile is waiting for administrator approval.</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white" to={ROUTES.COMPANY_INTERNSHIPS}>Manage internships</Link>
          <Link className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-primary" to={ROUTES.COMPANY_PROFILE}>Edit profile</Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map(([label, value]) => (
          <Card key={label} variant="bordered" padding="md">
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="mt-2 text-3xl font-bold text-text-primary">{number(value)}</p>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card variant="bordered" padding="md" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div><h3 className="font-bold text-text-primary">Your internships</h3><p className="text-xs text-text-muted">Live data from your company account</p></div>
            <Link className="text-xs font-semibold text-primary-600" to={ROUTES.COMPANY_INTERNSHIPS}>View all</Link>
          </div>
          {(dashboard?.internships ?? []).slice(0, 5).map((item) => (
            <div key={item._id} className="flex items-center justify-between gap-3 border-t border-border pt-3">
              <div className="min-w-0"><p className="truncate text-sm font-semibold text-text-primary">{item.title}</p><p className="text-xs text-text-muted">{number(item.applicationsCount)} applications</p></div>
              <Badge variant={item.moderationStatus === "approved" && item.isActive ? "success" : item.moderationStatus === "rejected" ? "danger" : "warning"}>{item.moderationStatus || "pending"}</Badge>
            </div>
          ))}
          {!dashboard?.internships?.length && <p className="text-sm text-text-muted">No internships yet.</p>}
        </Card>

        <Card variant="bordered" padding="md" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div><h3 className="font-bold text-text-primary">Recent applications</h3><p className="text-xs text-text-muted">Candidates who applied to your internships</p></div>
            <Link className="text-xs font-semibold text-primary-600" to={ROUTES.COMPANY_APPLICANTS}>Review all</Link>
          </div>
          {(dashboard?.recentApplications ?? []).map((application) => (
            <div key={application._id} className="flex items-center justify-between gap-3 border-t border-border pt-3">
              <div className="min-w-0"><p className="truncate text-sm font-semibold text-text-primary">{application.student?.user?.name || "Candidate"}</p><p className="truncate text-xs text-text-muted">{application.internship?.title || "Internship"}</p></div>
              <Badge variant={application.status === "Accepted" ? "success" : application.status === "Rejected" ? "danger" : "warning"}>{application.status}</Badge>
            </div>
          ))}
          {!dashboard?.recentApplications?.length && <p className="text-sm text-text-muted">No applications received yet.</p>}
        </Card>
      </section>
    </div>
  );
}

export default CompanyDashboard;
