import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Badge, Button, Card } from "../../components/ui/index.js";
import useAuth from "../../hooks/useAuth.js";
import { ROUTES } from "../../constants/routes.js";
import { getMyApplications } from "../../services/applicationService.js";
import { getInternships } from "../../services/internshipService.js";
import { getStudentProfile } from "../../services/studentService.js";

const STATUS = {
  Pending: { label: "Pending", variant: "warning" },
  Accepted: { label: "Accepted", variant: "success" },
  Rejected: { label: "Rejected", variant: "danger" },
};

export function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileMissing, setProfileMissing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.allSettled([getStudentProfile(), getMyApplications(), getInternships({ page: 1, limit: 3 })])
      .then(([profileResult, applicationsResult, internshipsResult]) => {
        if (!active) return;
        if (profileResult.status === "fulfilled") setProfile(profileResult.value);
        else if (/not found/i.test(profileResult.reason?.message || "")) setProfileMissing(true);
        else setError(profileResult.reason?.message || "Unable to load profile.");
        if (applicationsResult.status === "fulfilled") setApplications(applicationsResult.value);
        else if (!/not found/i.test(applicationsResult.reason?.message || "")) setError(applicationsResult.reason?.message || "Unable to load applications.");
        if (internshipsResult.status === "fulfilled") setRecommended(internshipsResult.value.internships);
        else setError(internshipsResult.reason?.message || "Unable to load internship recommendations.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) return <p className="py-12 text-center text-sm text-text-secondary">Loading your dashboard…</p>;

  const pending = applications.filter((item) => (item.status || "Pending") === "Pending").length;
  const accepted = applications.filter((item) => item.status === "Accepted").length;
  const rejected = applications.filter((item) => item.status === "Rejected").length;
  const stats = [["Applications", applications.length], ["Pending", pending], ["Accepted", accepted], ["Rejected", rejected]];
  const firstName = (user?.name || "Student").split(" ")[0];

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
        <div><p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Student workspace</p><h1 className="mt-2 text-2xl font-bold text-text-primary">Welcome, {firstName}</h1><p className="mt-1 text-sm text-text-secondary">{profile?.university || "Complete your academic profile to get started."}</p>{profile?.major && <p className="mt-1 text-xs text-text-muted">{profile.major} · Graduation {profile.graduationYear}</p>}</div>
        <div className="flex flex-wrap gap-2"><Link to={ROUTES.STUDENT_INTERNSHIPS}><Button>Explore internships</Button></Link><Link to={ROUTES.STUDENT_PROFILE}><Button variant="outline">My profile</Button></Link></div>
      </section>

      {profileMissing && <div className="rounded-xl border border-warning-200 bg-warning-50 p-4"><h2 className="font-semibold text-warning-900">Complete your student profile</h2><p className="mt-1 text-sm text-warning-800">You need an academic profile before you can apply for internships.</p><Link className="mt-3 inline-block text-sm font-semibold text-primary-700 underline" to={ROUTES.STUDENT_PROFILE}>Create profile</Link></div>}
      {error && <p role="alert" className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">{error}</p>}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([label, value]) => <Card key={label} padding="md"><p className="text-xs text-text-muted">{label}</p><p className="mt-2 text-3xl font-bold text-text-primary">{value}</p></Card>)}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between"><div><h2 className="font-bold text-text-primary">Recent applications</h2><p className="text-xs text-text-muted">Latest updates from employers</p></div><Link className="text-xs font-semibold text-primary-600" to={ROUTES.STUDENT_APPLICATIONS}>View all</Link></div>
          {applications.slice(0, 5).map((application) => {
            const internship = application.internship || {};
            const company = internship.company || {};
            const meta = STATUS[application.status] || STATUS.Pending;
            return <div key={application._id} className="flex items-center justify-between gap-3 border-t border-border pt-3"><div className="flex min-w-0 items-center gap-3"><Avatar name={company.companyName || company.user?.name || "Company"} size="sm" /><div className="min-w-0"><p className="truncate text-sm font-semibold text-text-primary">{internship.title || "Internship"}</p><p className="truncate text-xs text-text-muted">{company.companyName || company.user?.name || "Company"}</p></div></div><Badge variant={meta.variant}>{meta.label}</Badge></div>;
          })}
          {!applications.length && <p className="py-6 text-center text-sm text-text-muted">You haven't applied to any internship yet.</p>}
        </Card>

        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between"><div><h2 className="font-bold text-text-primary">Latest opportunities</h2><p className="text-xs text-text-muted">Verified and active internships</p></div><Link className="text-xs font-semibold text-primary-600" to={ROUTES.STUDENT_INTERNSHIPS}>Browse all</Link></div>
          {recommended.map((item) => {
            const companyName = item.company?.companyName || item.company?.user?.name || "Company";
            return <div key={item._id} className="flex items-center justify-between gap-3 border-t border-border pt-3"><div className="flex min-w-0 items-center gap-3"><Avatar name={companyName} size="sm" /><div className="min-w-0"><p className="truncate text-sm font-semibold text-text-primary">{item.title}</p><p className="truncate text-xs text-text-muted">{companyName} · {item.location || "Location not specified"}</p></div></div><Link className="shrink-0 text-xs font-semibold text-primary-600" to={ROUTES.STUDENT_INTERNSHIP_DETAILS.replace(":id", item._id)}>Details</Link></div>;
          })}
          {!recommended.length && <p className="py-6 text-center text-sm text-text-muted">No opportunities available right now.</p>}
        </Card>
      </section>
    </div>
  );
}

export default StudentDashboard;
