import { useMemo, useState } from 'react';
import { Badge, Card } from '../../components/ui/index.js';
import { MOCK_COMPANY_APPLICATIONS } from '../../constants/mockCompanyDashboard.js';
import useLocalStorage from '../../hooks/useLocalStorage.js';

const FILTERS = ['all', 'new', 'shortlisted', 'interview_scheduled', 'hired', 'rejected'];
const LABELS = {
  new: { label: 'New application', variant: 'info' },
  shortlisted: { label: 'Shortlisted', variant: 'primary' },
  interview_scheduled: { label: 'Interview scheduled', variant: 'warning' },
  hired: { label: 'Hired', variant: 'success' },
  rejected: { label: 'Declined', variant: 'danger' },
};

export function CompanyApplicantsPage() {
  const [applications, setApplications] = useLocalStorage('company-applicant-statuses', MOCK_COMPANY_APPLICATIONS);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => applications.filter((candidate) => {
    const matchesStatus = filter === 'all' || candidate.status === filter;
    const searchText = `${candidate.candidateName} ${candidate.university} ${candidate.roleApplied}`.toLowerCase();
    return matchesStatus && searchText.includes(query.trim().toLowerCase());
  }), [applications, filter, query]);

  const updateStatus = (id, nextStatus) => {
    setApplications((previous) => previous.map((candidate) => (
      candidate.id === id
        ? { ...candidate, status: nextStatus, statusLabel: LABELS[nextStatus].label, badgeVariant: LABELS[nextStatus].variant }
        : candidate
    )));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Applicants</h1>
        <p className="text-sm text-text-secondary mt-1">Review candidates and move applications through your hiring pipeline.</p>
      </div>
      <Card padding="md" className="space-y-4">
        <input aria-label="Search applicants" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by candidate, university, or role…" className="w-full h-10 rounded-lg border border-border px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100" />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item} className={`rounded-lg border px-3 py-2 text-xs font-semibold capitalize ${filter === item ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-border text-text-secondary hover:bg-secondary-50'}`}>
              {item === 'all' ? 'All candidates' : item.replaceAll('_', ' ')}
            </button>
          ))}
        </div>
        {filtered.length ? (
          <div className="divide-y divide-border">
            {filtered.map((candidate) => {
              const meta = LABELS[candidate.status] ?? LABELS.new;
              return (
                <article key={candidate.id} className="py-4 first:pt-0 last:pb-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-text-primary">{candidate.candidateName}</h2>
                    <p className="text-xs text-text-secondary mt-1">{candidate.degree} · {candidate.university}</p>
                    <p className="text-xs text-text-muted mt-1">{candidate.roleApplied} · Applied {candidate.appliedDate}</p>
                    <p className="text-[11px] text-text-muted mt-1">Academic GPA: {candidate.gpa}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                    <label className="text-xs text-text-secondary">
                      Update status
                      <select value={candidate.status} onChange={(event) => updateStatus(candidate.id, event.target.value)} className="ml-2 rounded-lg border border-border bg-white px-2 py-2 text-xs text-text-primary">
                        {FILTERS.filter((item) => item !== 'all').map((item) => <option key={item} value={item}>{LABELS[item].label}</option>)}
                      </select>
                    </label>
                  </div>
                </article>
              );
            })}
          </div>
        ) : <p className="py-8 text-center text-sm text-text-secondary">No candidates match this filter.</p>}
      </Card>
      <p className="text-[11px] text-text-muted">Prototype mode: status changes are saved locally in this browser. A backend is required to share updates with candidates and other recruiters.</p>
    </div>
  );
}

export default CompanyApplicantsPage;
