/**
 * @file routes/index.jsx
 * @description Application route tree with authentication and role guards.
 */

import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import { ROLES } from '../constants/roles.js';
import { useAuth } from '../hooks/index.js';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { DashboardLayout } from '../layouts/DashboardLayout.jsx';
import { ForgotPasswordPage, LoginPage, RegisterPage } from '../pages/auth/index.js';
import { CompanyApplicantsPage, CompanyDashboard, CompanyInternshipsPage, CompanyProfilePage } from '../pages/company/index.js';
import { InternshipDetailsPage, StudentApplicationsPage, StudentDashboard, StudentInternshipsPage, StudentProfilePage } from '../pages/student/index.js';

function RequireAuth({ allowedRoles }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-text-secondary" role="status">Loading your account…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    const fallback = user?.role === ROLES.COMPANY
      ? ROUTES.COMPANY_DASHBOARD
      : user?.role === ROLES.ADMIN
        ? ROUTES.ADMIN_DASHBOARD
        : ROUTES.STUDENT_DASHBOARD;

    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}

function RequireGuest() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Outlet />;

  const destination = user?.role === ROLES.COMPANY
    ? ROUTES.COMPANY_DASHBOARD
    : user?.role === ROLES.ADMIN
      ? ROUTES.ADMIN_DASHBOARD
      : ROUTES.STUDENT_DASHBOARD;

  return <Navigate to={destination} replace />;
}

const studentRoutes = [
  { path: ROUTES.STUDENT_DASHBOARD, element: <StudentDashboard /> },
  { path: ROUTES.STUDENT_INTERNSHIPS, element: <StudentInternshipsPage /> },
  { path: ROUTES.STUDENT_INTERNSHIP_DETAILS, element: <InternshipDetailsPage /> },
  { path: ROUTES.STUDENT_APPLICATIONS, element: <StudentApplicationsPage /> },
  { path: ROUTES.STUDENT_PROFILE, element: <StudentProfilePage /> },
];

const companyRoutes = [
  { path: ROUTES.COMPANY_DASHBOARD, element: <CompanyDashboard /> },
  { path: ROUTES.COMPANY_INTERNSHIPS, element: <CompanyInternshipsPage /> },
  { path: ROUTES.COMPANY_APPLICANTS, element: <CompanyApplicantsPage /> },
  { path: ROUTES.COMPANY_PROFILE, element: <CompanyProfilePage /> },
];

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [{
      element: <RequireGuest />,
      children: [
        { path: ROUTES.LOGIN, element: <LoginPage /> },
        { path: ROUTES.REGISTER, element: <RegisterPage /> },
        { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
      ],
    }],
  },
  {
    element: <RequireAuth allowedRoles={[ROLES.STUDENT]} />,
    children: [{
      element: <DashboardLayout />,
      children: studentRoutes,
    }],
  },
  {
    element: <RequireAuth allowedRoles={[ROLES.COMPANY]} />,
    children: [{
      element: <DashboardLayout />,
      children: companyRoutes,
    }],
  },
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.LOGIN} replace /> },
  { path: '*', element: <Navigate to={ROUTES.LOGIN} replace /> },
]);

export default router;
