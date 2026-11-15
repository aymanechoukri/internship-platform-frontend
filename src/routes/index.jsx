/**
 * @file routes/index.jsx
 * @description Central routing configuration for the Internship Platform.
 * Declares authentication routes under AuthLayout and dashboard/internship routes under DashboardLayout.
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { DashboardLayout } from '../layouts/DashboardLayout.jsx';
import { ForgotPasswordPage, LoginPage, RegisterPage } from '../pages/auth/index.js';
import { CompanyDashboard, CompanyInternshipsPage } from '../pages/company/index.js';
import { InternshipDetailsPage, StudentDashboard, StudentInternshipsPage } from '../pages/student/index.js';

export const router = createBrowserRouter([
  // ── Authentication Routes (Public) ──
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: <ForgotPasswordPage />,
      },
    ],
  },

  // ── Portal Dashboards & Modules ──
  {
    element: <DashboardLayout />,
    children: [
      // Student Routes
      {
        path: ROUTES.STUDENT_DASHBOARD,
        element: <StudentDashboard />,
      },
      {
        path: ROUTES.STUDENT_INTERNSHIPS,
        element: <StudentInternshipsPage />,
      },
      {
        path: ROUTES.STUDENT_INTERNSHIP_DETAILS,
        element: <InternshipDetailsPage />,
      },
      {
        path: ROUTES.STUDENT_SEARCH,
        element: <StudentInternshipsPage />,
      },
      {
        path: ROUTES.STUDENT_APPLICATIONS,
        element: <StudentDashboard />,
      },
      {
        path: ROUTES.STUDENT_PROFILE,
        element: <StudentDashboard />,
      },

      // Company Routes
      {
        path: ROUTES.COMPANY_DASHBOARD,
        element: <CompanyDashboard />,
      },
      {
        path: ROUTES.COMPANY_INTERNSHIPS,
        element: <CompanyInternshipsPage />,
      },
      {
        path: ROUTES.COMPANY_APPLICANTS,
        element: <CompanyDashboard />,
      },
      {
        path: ROUTES.COMPANY_PROFILE,
        element: <CompanyDashboard />,
      },
    ],
  },

  // ── Default & Wildcard Fallbacks ──
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.STUDENT_DASHBOARD} replace />,
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
]);

export default router;
