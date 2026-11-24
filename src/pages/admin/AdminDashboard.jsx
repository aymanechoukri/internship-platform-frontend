import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge, Input, Spinner } from '../../components/ui/index.js';
import apiClient from '../../services/apiClient.js';
import { ROUTES } from '../../constants/routes.js';
import useAuth from '../../hooks/useAuth.js';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'companies', label: 'Companies' },
  { id: 'internships', label: 'Internships' },
  { id: 'applications', label: 'Applications' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'logs', label: 'Activity Logs' },
];

const number = (value) => new Intl.NumberFormat().format(value ?? 0);
const date = (value) => value ? new Date(value).toLocaleDateString() : '—';

function StatCard({ label, value, detail, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    violet: 'bg-violet-50 text-violet-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  };
  return (
    <Card className="space-y-3">
      <p className="text-sm font-medium text-text-secondary">{label}</p>
      <p className="text-3xl font-bold tracking-tight text-text-primary">{number(value)}</p>
      <p className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{detail}</p>
    </Card>
  );
}

function StatusBadge({ active }) {
  return <Badge variant={active ? 'success' : 'danger'} dot>{active ? 'Active' : 'Disabled'}</Badge>;
}

function EmptyState({ title, message }) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-secondary-100 text-xl">⌕</div>
      <h3 className="font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary">{message}</p>
    </div>
  );
}

function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
      <p className="text-xs text-text-secondary">
        Showing page {pagination.page} of {pagination.totalPages} · {number(pagination.total)} records
      </p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={pagination.page <= 1} onClick={() => onPage(pagination.page - 1)}>Previous</Button>
        <Button size="sm" variant="outline" disabled={pagination.page >= pagination.totalPages} onClick={() => onPage(pagination.page + 1)}>Next</Button>
      </div>
    </div>
  );
}

function TableFrame({ children }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm">{children}</table></div>;
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [moderationStatus, setModerationStatus] = useState('all');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationContent, setNotificationContent] = useState('');
  const [notificationAudience, setNotificationAudience] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSignOut = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const loadOverview = useCallback(async () => {
    const response = await apiClient('/admin/overview');
    setOverview(response.data);
  }, []);

  const loadCollection = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (appliedSearch) params.set('search', appliedSearch);
    if (tab === 'users' && role !== 'all') params.set('role', role);
    if ((tab === 'users' || tab === 'internships') && status !== 'all') params.set('status', status);
    if (tab === 'companies' && status !== 'all') params.set('status', status);
    if (tab === 'internships' && moderationStatus !== 'all') params.set('moderationStatus', moderationStatus);
    const endpoint = ['users','companies','internships','applications','logs'].includes(tab) ? tab : 'users';
    const response = await apiClient(`/admin/${endpoint}?${params.toString()}`);
    setItems(response.data.items ?? []);
    setPagination(response.data.pagination ?? null);
  }, [tab, page, appliedSearch, role, status, moderationStatus]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (tab === 'overview') await loadOverview();
      else await loadCollection();
    } catch (err) {
      setError(err.message || 'Unable to load administration data.');
    } finally {
      setLoading(false);
    }
  }, [tab, loadOverview, loadCollection]);

  useEffect(() => { refresh(); }, [refresh]);

  const selectTab = (nextTab) => {
    setTab(nextTab);
    setPage(1);
    setSearch('');
    setAppliedSearch('');
    setRole('all');
    setStatus('all');
    setModerationStatus('all');
    setNotice('');
  };

  const applySearch = (event) => {
    event.preventDefault();
    setPage(1);
    setAppliedSearch(search.trim());
  };

  const toggleUser = async (item) => {
    const nextActive = item.isActive === false;
    const label = nextActive ? 'enable' : 'disable';
    if (!window.confirm(`Are you sure you want to ${label} ${item.name}?`)) return;
    setActionId(item._id);
    setError('');
    setNotice('');
    try {
      await apiClient(`/admin/users/${item._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: nextActive }),
      });
      setNotice(`Account ${nextActive ? 'enabled' : 'disabled'} successfully.`);
      await refresh();
    } catch (err) {
      setError(err.message || 'Could not update this account.');
    } finally {
      setActionId('');
    }
  };

  const reviewCompany = async (item, decision) => {
    const reason = decision === 'rejected' ? window.prompt('Reason for rejection (required):') : '';
    if (decision === 'rejected' && (!reason || reason.trim().length < 5)) return;
    if (!window.confirm(`${decision === 'approved' ? 'Approve' : 'Reject'} ${item.companyName}?`)) return;
    setActionId(item._id); setError(''); setNotice('');
    try { await apiClient(`/admin/companies/${item._id}/review`, { method: 'PATCH', body: JSON.stringify({ decision, reason }) }); setNotice(`Company ${decision}.`); await refresh(); }
    catch (err) { setError(err.message || 'Company review failed.'); } finally { setActionId(''); }
  };

  const reviewInternship = async (item, decision) => {
    const reason = decision === 'rejected' ? window.prompt('Reason for rejection (required):') : '';
    if (decision === 'rejected' && (!reason || reason.trim().length < 5)) return;
    if (!window.confirm(`${decision === 'approved' ? 'Approve' : 'Reject'} internship “${item.title}”?`)) return;
    setActionId(item._id); setError(''); setNotice('');
    try { await apiClient(`/admin/internships/${item._id}/review`, { method: 'PATCH', body: JSON.stringify({ decision, reason }) }); setNotice(`Internship ${decision}.`); await refresh(); }
    catch (err) { setError(err.message || 'Internship review failed.'); } finally { setActionId(''); }
  };

  const deleteUser = async (item) => {
    if (!window.confirm(`Permanently delete ${item.name} and associated profile data? This cannot be undone.`)) return;
    setActionId(item._id); setError(''); setNotice('');
    try { await apiClient(`/admin/users/${item._id}`, { method: 'DELETE' }); setNotice('User and associated records deleted.'); await refresh(); }
    catch (err) { setError(err.message || 'Could not delete user.'); } finally { setActionId(''); }
  };

  const editUser = async (item) => {
    const name = window.prompt('Update full name:', item.name); if (name === null) return;
    const email = window.prompt('Update email:', item.email); if (email === null) return;
    setActionId(item._id); setError(''); setNotice('');
    try { await apiClient(`/admin/users/${item._id}`, { method: 'PATCH', body: JSON.stringify({ name, email }) }); setNotice('User details updated.'); await refresh(); }
    catch (err) { setError(err.message || 'Could not update user.'); } finally { setActionId(''); }
  };

  const sendNotification = async (event) => {
    event.preventDefault(); setError(''); setNotice('');
    try { const response = await apiClient('/admin/notifications', { method: 'POST', body: JSON.stringify({ title: notificationTitle, content: notificationContent, audience: notificationAudience }) }); setNotice(`Notification sent to ${response.data.sent} accounts.`); setNotificationTitle(''); setNotificationContent(''); }
    catch (err) { setError(err.message || 'Could not send notification.'); }
  };

  const toggleInternship = async (item) => {
    const nextActive = !item.isActive;
    if (!window.confirm(`Are you sure you want to ${nextActive ? 'publish' : 'pause'} “${item.title}”?`)) return;
    setActionId(item._id);
    setError('');
    setNotice('');
    try {
      await apiClient(`/admin/internships/${item._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: nextActive }),
      });
      setNotice(`Internship ${nextActive ? 'published' : 'paused'} successfully.`);
      await refresh();
    } catch (err) {
      setError(err.message || 'Could not update this internship.');
    } finally {
      setActionId('');
    }
  };

  const stats = overview?.stats;
  const applicationTotal = useMemo(() => {
    const a = stats?.applications ?? {};
    return (a.pending ?? 0) + (a.accepted ?? 0) + (a.rejected ?? 0);
  }, [stats]);

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">InternPlatform · Control center</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary">Administration</h1>
            <p className="mt-1 text-sm text-text-secondary">Manage platform activity, accounts and internship listings.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-text-primary">{user?.name ?? user?.fullName ?? 'Administrator'}</p>
              <p className="text-xs text-text-muted">Platform administrator</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-7 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap gap-2" aria-label="Administration sections">
          {TABS.map((item) => (
            <button key={item.id} type="button" onClick={() => selectTab(item.id)}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${tab === item.id ? 'bg-primary-600 text-white shadow-sm' : 'border border-border bg-surface text-text-secondary hover:bg-secondary-50'}`}>
              {item.label}
            </button>
          ))}
        </nav>

        {error && <div role="alert" className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={() => setError('')} aria-label="Dismiss error">×</button></div>}
        {notice && <div role="status" className="flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-text-secondary"><Spinner /> Loading administration data…</div>
        ) : tab === 'overview' ? (
          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><h2 className="text-lg font-bold text-text-primary">Platform overview</h2><p className="text-sm text-text-secondary">Live totals from the platform database.</p></div>
              <Button size="sm" variant="outline" onClick={refresh}>Refresh data</Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total accounts" value={stats?.totalUsers} detail={`${number(stats?.students)} students`} tone="blue" />
              <StatCard label="Company accounts" value={stats?.companies} detail="Registered companies" tone="violet" />
              <StatCard label="Internship listings" value={stats?.totalInternships} detail={`${number(stats?.activeInternships)} currently active`} tone="green" />
              <StatCard label="Applications" value={applicationTotal} detail={`${number(stats?.applications?.pending)} pending review`} tone="amber" />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card padding="none">
                <div className="border-b border-border px-5 py-4"><h3 className="font-semibold text-text-primary">Recent accounts</h3><p className="mt-1 text-xs text-text-muted">The latest registered platform users</p></div>
                {overview?.recentUsers?.length ? <div className="divide-y divide-border">{overview.recentUsers.map((item) => <div key={item._id} className="flex items-center justify-between gap-3 px-5 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-text-primary">{item.name}</p><p className="truncate text-xs text-text-muted">{item.email}</p></div><div className="text-right"><Badge variant={item.role === 'admin' ? 'primary' : 'default'}>{item.role}</Badge><p className="mt-1 text-[11px] text-text-muted">{date(item.createdAt)}</p></div></div>)}</div> : <EmptyState title="No accounts yet" message="New accounts will appear here." />}
              </Card>
              <Card padding="none">
                <div className="border-b border-border px-5 py-4"><h3 className="font-semibold text-text-primary">Recent internships</h3><p className="mt-1 text-xs text-text-muted">Latest opportunities added to the platform</p></div>
                {overview?.recentInternships?.length ? <div className="divide-y divide-border">{overview.recentInternships.map((item) => <div key={item._id} className="flex items-center justify-between gap-3 px-5 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-text-primary">{item.title}</p><p className="truncate text-xs text-text-muted">{item.company?.companyName ?? 'Company'} · {item.location || 'Location not specified'}</p></div><div className="text-right"><StatusBadge active={item.isActive} /><p className="mt-1 text-[11px] text-text-muted">{date(item.createdAt)}</p></div></div>)}</div> : <EmptyState title="No internships yet" message="Published opportunities will appear here." />}
              </Card>
            </div>
            <Card>
              <h3 className="font-semibold text-text-primary">Application breakdown</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-amber-50 p-4"><p className="text-xs font-medium text-amber-700">Pending</p><p className="mt-1 text-2xl font-bold text-amber-800">{number(stats?.applications?.pending)}</p></div>
                <div className="rounded-lg bg-emerald-50 p-4"><p className="text-xs font-medium text-emerald-700">Accepted</p><p className="mt-1 text-2xl font-bold text-emerald-800">{number(stats?.applications?.accepted)}</p></div>
                <div className="rounded-lg bg-red-50 p-4"><p className="text-xs font-medium text-red-700">Rejected</p><p className="mt-1 text-2xl font-bold text-red-800">{number(stats?.applications?.rejected)}</p></div>
              </div>
            </Card>
          </section>
        ) : (
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><h2 className="text-lg font-bold text-text-primary">{tab === 'users' ? 'User management' : tab === 'companies' ? 'Company verification' : tab === 'internships' ? 'Internship moderation' : tab === 'applications' ? 'Applications' : tab === 'logs' ? 'Activity logs' : 'Notifications'}</h2><p className="text-sm text-text-secondary">{tab === 'users' ? 'Search accounts and control access to the platform.' : tab === 'companies' ? 'Approve or reject employer accounts.' : tab === 'internships' ? 'Review listings before publication.' : tab === 'applications' ? 'Monitor applications across the platform.' : tab === 'logs' ? 'Review administrator actions.' : 'Send platform announcements and account notifications.'}</p></div>
              <Button size="sm" variant="outline" onClick={refresh}>Refresh</Button>
            </div>
            <Card padding="none">
              <form onSubmit={applySearch} className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1"><Input label="Search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={tab === 'users' ? 'Name or email address' : tab === 'companies' ? 'Company, industry or location' : 'Internship title or location'} /></div>
                {tab === 'users' && <label className="flex flex-col gap-1.5 text-sm font-medium text-text-primary">Role<select className="h-10 rounded-lg border border-border bg-white px-3 text-sm" value={role} onChange={(event) => { setRole(event.target.value); setPage(1); }}><option value="all">All roles</option><option value="student">Student</option><option value="company">Company</option><option value="admin">Admin</option></select></label>}
                {(tab === 'users' || tab === 'internships' || tab === 'companies') && <label className="flex flex-col gap-1.5 text-sm font-medium text-text-primary">Status<select className="h-10 rounded-lg border border-border bg-white px-3 text-sm" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="all">All statuses</option><option value={tab === 'users' ? 'active' : 'active'}>Active</option>{tab === 'users' ? <option value="disabled">Disabled</option> : tab === 'internships' ? <option value="inactive">Inactive</option> : <><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></>}</select></label>}
                {tab === 'internships' && <label className="flex flex-col gap-1.5 text-sm font-medium text-text-primary">Review<select className="h-10 rounded-lg border border-border bg-white px-3 text-sm" value={moderationStatus} onChange={(event) => { setModerationStatus(event.target.value); setPage(1); }}><option value="all">All reviews</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></label>}
                <Button type="submit">Search</Button>
              </form>

              {items.length === 0 ? <EmptyState title="No results found" message="Try changing your search or filters." /> : tab === 'users' ? (
                <TableFrame><thead className="bg-secondary-50 text-xs uppercase tracking-wide text-text-muted"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-border">{items.map((item) => <tr key={item._id}><td className="px-4 py-4"><p className="font-semibold text-text-primary">{item.name}</p><p className="text-xs text-text-muted">{item.email}</p></td><td className="px-4 py-4"><Badge variant={item.role === 'admin' ? 'primary' : 'default'}>{item.role}</Badge></td><td className="px-4 py-4 text-text-secondary">{date(item.createdAt)}</td><td className="px-4 py-4"><StatusBadge active={item.isActive !== false} /></td><td className="px-4 py-4 text-right"><Button size="sm" variant={item.isActive === false ? 'primary' : 'outline'} disabled={actionId === item._id || (item.role === 'admin' && item._id === user?._id)} onClick={() => toggleUser(item)}>{actionId === item._id ? 'Saving…' : item.isActive === false ? 'Enable' : 'Disable'}</Button></td></tr>)}</tbody></TableFrame>
              ) : tab === 'companies' ? (
                <TableFrame><thead className="bg-secondary-50 text-xs uppercase tracking-wide text-text-muted"><tr><th className="px-4 py-3">Company</th><th className="px-4 py-3">Industry</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Account owner</th><th className="px-4 py-3">Verification</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3">Review</th></tr></thead><tbody className="divide-y divide-border">{items.map((item) => <tr key={item._id}><td className="px-4 py-4 font-semibold text-text-primary">{item.companyName}</td><td className="px-4 py-4 text-text-secondary">{item.industry || '—'}</td><td className="px-4 py-4 text-text-secondary">{item.location || '—'}</td><td className="px-4 py-4"><p className="text-text-primary">{item.user?.name ?? '—'}</p><p className="text-xs text-text-muted">{item.user?.email ?? ''}</p></td><td className="px-4 py-4"><Badge variant={item.verificationStatus === 'approved' ? 'success' : item.verificationStatus === 'rejected' ? 'danger' : 'warning'}>{item.verificationStatus || 'pending'}</Badge>{item.rejectionReason && <p className="mt-1 max-w-48 text-xs text-red-600">{item.rejectionReason}</p>}</td><td className="px-4 py-4 text-text-secondary">{date(item.createdAt)}</td><td className="px-4 py-4"><div className="flex gap-2"><Button size="sm" disabled={actionId === item._id || item.verificationStatus === 'approved'} onClick={() => reviewCompany(item, 'approved')}>Approve</Button><Button size="sm" variant="outline" disabled={actionId === item._id || item.verificationStatus === 'rejected'} onClick={() => reviewCompany(item, 'rejected')}>Reject</Button></div></td></tr>)}</tbody></TableFrame>
              ) : (
                <TableFrame><thead className="bg-secondary-50 text-xs uppercase tracking-wide text-text-muted"><tr><th className="px-4 py-3">Opportunity</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Created</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Review</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-border">{items.map((item) => <tr key={item._id}><td className="px-4 py-4"><p className="font-semibold text-text-primary">{item.title}</p><p className="text-xs text-text-muted">{item.location || 'Location not specified'}</p></td><td className="px-4 py-4 text-text-secondary">{item.company?.companyName ?? '—'}</td><td className="px-4 py-4 text-text-secondary">{item.type}</td><td className="px-4 py-4 text-text-secondary">{date(item.createdAt)}</td><td className="px-4 py-4"><StatusBadge active={item.isActive} /></td><td className="px-4 py-4"><Badge variant={item.moderationStatus === 'approved' ? 'success' : item.moderationStatus === 'rejected' ? 'danger' : 'warning'}>{item.moderationStatus || 'pending'}</Badge></td><td className="px-4 py-4 text-right"><div className="flex gap-2"><Button size="sm" disabled={actionId === item._id || item.moderationStatus === 'approved'} onClick={() => reviewInternship(item, 'approved')}>Approve</Button><Button size="sm" variant="outline" disabled={actionId === item._id || item.moderationStatus === 'rejected'} onClick={() => reviewInternship(item, 'rejected')}>Reject</Button><Button size="sm" variant="outline" disabled={actionId === item._id} onClick={() => toggleInternship(item)}>{item.isActive ? 'Pause' : 'Publish'}</Button></div></td></tr>)}</tbody></TableFrame>
              ) : tab === 'applications' ? (
                <TableFrame><thead className="bg-secondary-50 text-xs uppercase tracking-wide text-text-muted"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Internship</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Applied</th></tr></thead><tbody className="divide-y divide-border">{items.map((item) => <tr key={item._id}><td className="px-4 py-4">{item.student?.user?.name || '—'}<p className="text-xs text-text-muted">{item.student?.user?.email || ''}</p></td><td className="px-4 py-4">{item.internship?.title || '—'}</td><td className="px-4 py-4">{item.internship?.company?.companyName || '—'}</td><td className="px-4 py-4"><Badge>{item.status}</Badge></td><td className="px-4 py-4">{date(item.createdAt)}</td></tr>)}</tbody></TableFrame>
              ) : tab === 'logs' ? (
                <TableFrame><thead className="bg-secondary-50 text-xs uppercase tracking-wide text-text-muted"><tr><th className="px-4 py-3">Administrator</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Target</th><th className="px-4 py-3">Details</th><th className="px-4 py-3">Date</th></tr></thead><tbody className="divide-y divide-border">{items.map((item) => <tr key={item._id}><td className="px-4 py-4">{item.admin?.name || '—'}</td><td className="px-4 py-4">{item.action}</td><td className="px-4 py-4">{item.targetType}</td><td className="px-4 py-4">{item.details || '—'}</td><td className="px-4 py-4">{date(item.createdAt)}</td></tr>)}</tbody></TableFrame>
              ) : tab === 'notifications' ? (
                <form onSubmit={sendNotification} className="space-y-4 p-5"><label className="block text-sm font-medium">Audience<select className="mt-1 h-10 w-full rounded-lg border border-border bg-white px-3" value={notificationAudience} onChange={(event) => setNotificationAudience(event.target.value)}><option value="all">All users</option><option value="students">Students</option><option value="companies">Companies</option></select></label><label className="block text-sm font-medium">Title<input required maxLength={120} className="mt-1 h-10 w-full rounded-lg border border-border px-3" value={notificationTitle} onChange={(event) => setNotificationTitle(event.target.value)} /></label><label className="block text-sm font-medium">Message<textarea required maxLength={2000} rows={4} className="mt-1 w-full rounded-lg border border-border p-3" value={notificationContent} onChange={(event) => setNotificationContent(event.target.value)} /></label><Button type="submit">Send notification</Button></form>
              ) : null}
              <Pagination pagination={pagination} onPage={setPage} />
            </Card>
          </section>
        )}
        <p className="text-center text-xs text-text-muted">Administrative actions are logged by the API response. Account and listing changes can be reversed.</p>
      </main>
    </div>
  );
}

export default AdminDashboardPage;
