import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../../components/ui/index.js';
import { ROUTES } from '../../constants/routes.js';
import useAuth from '../../hooks/useAuth.js';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <main className="min-h-screen bg-bg px-4 py-12">
      <Card padding="lg" className="mx-auto max-w-2xl space-y-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">Administration</span>
          <h1 className="mt-2 text-2xl font-bold text-text-primary">Admin access is configured</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Signed in as {user?.fullName ?? user?.name ?? user?.email ?? 'administrator'}.
            The administrative management modules are not implemented in this frontend yet.
          </p>
        </div>
        <div className="rounded-xl border border-warning-500/30 bg-warning-50 p-4 text-sm text-warning-700">
          User, company, and platform-management screens must be connected to authorized admin API endpoints before this portal can be used operationally.
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleSignOut}>Sign out</Button>
        </div>
      </Card>
    </main>
  );
}

export default AdminDashboardPage;
