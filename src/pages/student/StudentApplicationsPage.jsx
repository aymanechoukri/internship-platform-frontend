import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Card } from '../../components/ui/index.js';
import { MOCK_STUDENT_APPLICATIONS } from '../../constants/mockStudentDashboard.js';
import { ROUTES } from '../../constants/routes.js';
import useLocalStorage from '../../hooks/useLocalStorage.js';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All applications' },
  { value: 'under_review', label: 'Under review' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Not selected' },
];

const STATUS_META = {
  under_review: { label: 'Under review', variant: 'warning' },
  interviewing: { label: 'Interviewing', variant: 'primary' },
  accepted: { label: 'Accepted', variant: 'success' },
  rejected: { label: 'Not selected', variant: 'danger' },
  submitted: { label: 'Submitted', variant: 'info' },
};

export function StudentApplicationsPage() {
  const [applications] = useLocalStorage('student-applications', MOCK_STUDENT_APPLICATIONS);
  const [status, setStatus] = useState('all');
  const filteredApplications = useMemo(
    () => applications.filter((item) => status === 'all' || item.status === status),
    [applications, status],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">My applications</h1>
          <p className="text-sm text-text-secondary mt-1">Review your submitted applications and their latest status.</p>
        </div>
        <Badge variant="primary">{applications.length} total</Badge>
      </div>

      <Card padding="md" className="space-y-4">
        <div className="flex flex-wrap gap-2" aria-label="Filter applications by status">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatus(option.value)}
              aria-pressed={status === option.value}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${status === option.value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-border text-text-secondary hover:bg-secondary-50'}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {filteredApplications.length ? (
          <div className="divide-y divide-border">
            {filteredApplications.map((application) => {
              const meta = STATUS_META[application.status] ?? {
                label: application.statusLabel ?? application.status ?? 'Pending',
                variant: 'default',
              };
              return (
                <article key={application.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-sm text-text-primary">{application.internshipTitle ?? application.title}</h2>
                    <p className="text-xs text-text-secondary mt-1">{application.companyName ?? application.company} · {application.location ?? 'Location not specified'}</p>
                    <p className="text-[11px] text-text-muted mt-1">Applied {application.appliedDate ?? application.appliedAt ?? 'recently'}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                    {application.internshipId && (
                      <Link className="text-xs font-semibold text-primary-600 hover:text-primary-700" to={`/student/internships/${application.internshipId}`}>View role</Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <h2 className="font-semibold text-text-primary">No applications found</h2>
            <p className="text-sm text-text-secondary mt-1">Try another status filter or discover an opportunity.</p>
            <Link to={ROUTES.STUDENT_INTERNSHIPS}><Button className="mt-4">Browse internships</Button></Link>
          </div>
        )}
      </Card>
      <p className="text-[11px] text-text-muted">Prototype mode: sample records and applications submitted in this browser are stored locally. A backend is required for shared, production data.</p>
    </div>
  );
}

export default StudentApplicationsPage;
