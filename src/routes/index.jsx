/**
 * @file routes/index.jsx
 * @description Central routing configuration for the Internship Platform.
 * Configures all public authentication routes nested inside AuthLayout.
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { ForgotPasswordPage, LoginPage, RegisterPage } from '../pages/auth/index.js';

export const router = createBrowserRouter([
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
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
]);

export default router;
