/**
 * @file pages/auth/LoginPage.jsx
 * @description Sign-in page for students, companies, and administrators.
 * Includes email & password fields, show/hide password toggle, remember-me checkbox,
 * client-side validation, and links to registration and password reset.
 */

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui/index.js';
import { ROUTES } from '../../constants/routes.js';
import { isValidEmail } from '../../utils/validators.js';
import { login as signIn } from '../../services/authService.js';
import useAuth from '../../hooks/useAuth.js';

/* ── Inline SVG Icons ── */
function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function EyeSlashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
      <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setIsLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'Email address is required';
    } else if (!isValidEmail(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedMessage('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const response = await signIn({ email: formData.email.trim(), password: formData.password });
      const token = response?.token ?? response?.accessToken ?? response?.access_token ?? response?.data?.token;
      const rawUser = response?.user ?? response?.data?.user;
      if (!token || !rawUser) throw new Error('The API response must include a user and an authentication token.');
      const user = { ...rawUser, role: String(rawUser.role ?? rawUser.accountType ?? '').toLowerCase() };
      if (!['student', 'company', 'admin'].includes(user.role)) throw new Error('Your account has an unsupported role.');
      login(user, token, formData.rememberMe);
      const destination = user.role === 'company' ? ROUTES.COMPANY_DASHBOARD : user.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.STUDENT_DASHBOARD;
      navigate(location.state?.from?.pathname ?? destination, { replace: true });
    } catch (error) {
      setSubmittedMessage(error.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <Card variant="bordered" padding="lg" className="shadow-sm border-border bg-surface">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-text-secondary mt-1.5">
          Sign in to access your internship dashboard
        </p>
      </div>

      {submittedMessage && (
        <div
          role="status"
          className="mb-5 p-3.5 rounded-lg bg-danger-50 border border-danger-200 text-xs text-danger-700 flex items-start gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-danger-600 shrink-0 mt-0.5"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
              clipRule="evenodd"
            />
          </svg>
          <span>{submittedMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email Field */}
        <Input
          label="Email address"
          type="email"
          name="email"
          id="login-email"
          autoComplete="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          leftIcon={<MailIcon />}
        />

        {/* Password Field with Show/Hide toggle */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          id="login-password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          leftIcon={<LockIcon />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-text-muted hover:text-text-primary p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          }
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              id="login-remember-me"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer accent-primary-600"
            />
            <span className="text-xs font-medium text-text-secondary">
              Remember me
            </span>
          </label>

          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus-visible:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isSubmitting}
          className="mt-2"
        >
          Sign in
        </Button>
      </form>

      {/* Footer Link to Register */}
      <div className="text-center pt-6 mt-6 border-t border-border">
        <p className="text-xs text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus-visible:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default LoginPage;
