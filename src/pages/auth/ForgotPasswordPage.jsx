/**
 * @file pages/auth/ForgotPasswordPage.jsx
 * @description Password reset request page.
 * Includes email input, submit button with loading state, success message confirmation,
 * and a clear back-to-login link.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui/index.js';
import { ROUTES } from '../../constants/routes.js';
import { isValidEmail } from '../../utils/validators.js';

/* ── Inline SVG Icons ── */
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

function ArrowLeftIcon() {
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
        d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-12 h-12 text-success-500 mx-auto"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.74-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Frontend-only presentation simulation (no backend connection)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <Card variant="bordered" padding="lg" className="shadow-sm border-border bg-surface">
      {!isSubmitted ? (
        <>
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-3">
              <MailIcon />
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Reset your password
            </h1>
            <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
              Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Email address"
              type="email"
              id="reset-email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              error={error}
              leftIcon={<MailIcon />}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={isSubmitting}
              className="mt-2"
            >
              Send reset instructions
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center py-2 space-y-4">
          <CheckCircleIcon />
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Check your email
            </h1>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              We&apos;ve sent password reset instructions to:
            </p>
            <p className="text-sm font-semibold text-text-primary mt-1 bg-secondary-50 py-1.5 px-3 rounded-lg border border-border inline-block">
              {email}
            </p>
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            Did not receive the email? Check your spam folder or try requesting a new link below.
          </p>

          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={() => {
              setIsSubmitted(false);
            }}
          >
            Resend or change email
          </Button>
        </div>
      )}

      {/* Back to Login Link */}
      <div className="text-center pt-6 mt-6 border-t border-border">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus-visible:underline"
        >
          <ArrowLeftIcon />
          <span>Back to sign in</span>
        </Link>
      </div>
    </Card>
  );
}

export default ForgotPasswordPage;
