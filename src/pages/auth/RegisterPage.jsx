/**
 * @file pages/auth/RegisterPage.jsx
 * @description Registration page for new students and companies.
 * Includes full name, email, password, confirm password, account type selector (Student/Company),
 * terms & conditions checkbox, show/hide password toggles, and inline validation.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui/index.js';
import { ROLES } from '../../constants/roles.js';
import { ROUTES } from '../../constants/routes.js';
import { isStrongPassword, isValidEmail } from '../../utils/validators.js';
import { register as createAccount } from '../../services/authService.js';

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

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
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

function AcademicCapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M10.394 2.08a1 1 0 0 0-.788 0l-7 3a1 1 0 0 0 0 1.84L5.25 8.051a.999.999 0 0 1 .356-.257l4-1.714a1 1 0 1 1 .788 1.838L7.667 9.088l1.94.831a1 1 0 0 0 .787 0l7-3a1 1 0 0 0 0-1.838l-7-3ZM3.31 9.397 5 10.12v4.102a8.969 8.969 0 0 0-1.05-.174 1 1 0 0 1-.89-.89 11.115 11.115 0 0 1 .25-3.762ZM9.3 16.573A9.026 9.026 0 0 1 7 14.935v-3.957l1.818.78a3 3 0 0 0 2.364 0l5.508-2.361a11.026 11.026 0 0 1 .25 3.762 1 1 0 0 1-.89.89 8.968 8.968 0 0 1-5.35 2.524 1 1 0 0 1-.4-.002ZM6.64 8.79l-2.02-.865L10 5.626l5.38 2.299-2.02.866L10 7.374 6.64 8.79Z" />
    </svg>
  );
}

function BuildingOfficeIcon() {
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
        d="M4 2a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 4 18h12a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16 2H4Zm1 3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V5Zm0 4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V9Zm0 4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V13Zm6-8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V5Zm0 4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V9Zm0 4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V13Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: ROLES.STUDENT, // default to student
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, accountType: role }));
    if (errors.accountType) {
      setErrors((prev) => ({ ...prev, accountType: undefined }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      nextErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email address is required';
    } else if (!isValidEmail(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required';
    } else if (!isStrongPassword(formData.password)) {
      nextErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.accountType) {
      nextErrors.accountType = 'Please select an account type';
    }

    if (!formData.acceptTerms) {
      nextErrors.acceptTerms = 'You must accept the terms and conditions';
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
    try {
      await createAccount({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.accountType,
      });
      navigate(ROUTES.LOGIN, { replace: true, state: { message: 'Account created successfully. Please sign in.' } });
    } catch (error) {
      setSubmittedMessage(error.message || 'Unable to create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="bordered" padding="lg" className="shadow-sm border-border bg-surface">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-text-secondary mt-1.5">
          Join as a student looking for opportunities or an employer hiring talent
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
        {/* Account Type Selector (Student vs Company) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">
            I am joining as a
          </label>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Account type">
            <button
              type="button"
              role="radio"
              aria-checked={formData.accountType === ROLES.STUDENT}
              onClick={() => handleRoleSelect(ROLES.STUDENT)}
              className={[
                'flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all select-none',
                formData.accountType === ROLES.STUDENT
                  ? 'border-primary-600 bg-primary-50 text-primary-700 ring-1 ring-primary-600 shadow-xs'
                  : 'border-border bg-surface text-text-secondary hover:border-secondary-400',
              ].join(' ')}
            >
              <AcademicCapIcon />
              <span>Student / Intern</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={formData.accountType === ROLES.COMPANY}
              onClick={() => handleRoleSelect(ROLES.COMPANY)}
              className={[
                'flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all select-none',
                formData.accountType === ROLES.COMPANY
                  ? 'border-primary-600 bg-primary-50 text-primary-700 ring-1 ring-primary-600 shadow-xs'
                  : 'border-border bg-surface text-text-secondary hover:border-secondary-400',
              ].join(' ')}
            >
              <BuildingOfficeIcon />
              <span>Company / Recruiter</span>
            </button>
          </div>
          {errors.accountType && (
            <p className="text-xs text-danger-500" role="alert">
              {errors.accountType}
            </p>
          )}
        </div>

        {/* Full Name Field */}
        <Input
          label="Full name"
          type="text"
          name="fullName"
          id="register-fullname"
          autoComplete="name"
          placeholder="e.g. Alex Morgan"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          leftIcon={<UserIcon />}
        />

        {/* Email Field */}
        <Input
          label="Email address"
          type="email"
          name="email"
          id="register-email"
          autoComplete="email"
          placeholder="name@university.edu"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          leftIcon={<MailIcon />}
        />

        {/* Password Field */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          id="register-password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          helperText={!errors.password ? 'Must contain at least 8 characters' : undefined}
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

        {/* Confirm Password Field */}
        <Input
          label="Confirm password"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          id="register-confirm-password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          leftIcon={<LockIcon />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="text-text-muted hover:text-text-primary p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded transition-colors"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          }
        />

        {/* Terms and Conditions Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="acceptTerms"
              id="register-accept-terms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="w-4 h-4 mt-0.5 rounded border-border text-primary-600 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer accent-primary-600 shrink-0"
            />
            <span className="text-xs text-text-secondary leading-normal">
              I agree to the{' '}
              <a
                href="#terms"
                className="font-medium text-primary-600 hover:text-primary-700 underline underline-offset-2"
                onClick={(e) => e.stopPropagation()}
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#privacy"
                className="font-medium text-primary-600 hover:text-primary-700 underline underline-offset-2"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-xs text-danger-500 mt-1" role="alert">
              {errors.acceptTerms}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isSubmitting}
          className="mt-3"
        >
          Create account
        </Button>
      </form>

      {/* Footer Link to Login */}
      <div className="text-center pt-6 mt-6 border-t border-border">
        <p className="text-xs text-text-secondary">
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus-visible:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default RegisterPage;
