/**
 * @file layouts/AuthLayout.jsx
 * @description Dedicated authentication layout for Login, Register, and Forgot Password pages.
 * Provides consistent SaaS visual hierarchy, platform branding, responsive layout, and footer.
 */

import { Link, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between selection:bg-primary-100 selection:text-primary-700">
      {/* ── Top Navigation Bar ── */}
      <header className="w-full border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg p-1"
          >
            <span className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm group-hover:bg-primary-700 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.24.09-.364.09a.755.755 0 0 1-.364-.09l-.003-.001A49.95 49.95 0 0 0 2.1 10.057a.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                <path d="M13.06 15.473a48.455 48.455 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.726 19.824 19.824 0 0 1-8.521 1.799 19.824 19.824 0 0 1-8.522-1.8.75.75 0 0 1-.459-.724c.035-1.442.121-2.87.255-4.285a48.455 48.455 0 0 1 7.666 3.282.75.75 0 0 0 .62 0Z" />
                <path d="M20.25 10.332v9.918a.75.75 0 0 1-1.5 0v-8.82a50.764 50.764 0 0 0-6.75 2.574V21a.75.75 0 0 1-1.5 0v-6.996a50.75 50.75 0 0 0-6.75-2.574v8.82a.75.75 0 0 1-1.5 0v-9.918a48.48 48.48 0 0 1 8.25 3.324 48.48 48.48 0 0 1 8.25-3.324Z" />
              </svg>
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-text-primary text-base tracking-tight leading-none">
                InternPlatform
              </span>
              <span className="text-[11px] text-text-muted font-medium tracking-wide">
                Career Launchpad
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted hidden sm:inline">
              Need assistance?
            </span>
            <a
              href="mailto:support@internplatform.example"
              className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md my-auto">
          {children || <Outlet />}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-border bg-surface py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} InternPlatform Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#terms" className="hover:text-text-secondary transition-colors">
              Terms of Service
            </a>
            <a href="#privacy" className="hover:text-text-secondary transition-colors">
              Privacy Policy
            </a>
            <a href="#security" className="hover:text-text-secondary transition-colors">
              Security
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AuthLayout;
