/**
 * @file pages/student/InternshipDetailsPage.jsx
 * @description Detailed overview page for a single internship opportunity.
 * Displays role specifications, company bio, responsibilities, required skills,
 * demo application flow, bookmark state, and friendly 404 Not Found fallback for invalid IDs.
 */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, Badge, Button, Card } from '../../components/ui/index.js';
import { MOCK_INTERNSHIPS } from '../../constants/mockInternships.js';
import { ROUTES } from '../../constants/routes.js';

/* ── Inline SVG Icons ── */
function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
    </svg>
  );
}

function BookmarkIcon({ filled = false }) {
  if (filled) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-primary-600">
        <path d="M5 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14l-5-2.5L5 18V4Z" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-4 h-4 text-inherit">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-success-600 shrink-0">
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
    </svg>
  );
}

function BuildingOfficeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M4 2a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 4 18h12a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16 2H4Zm1 3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V5Zm0 4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V9Zm0 4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V13Zm6-8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V5Zm0 4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V9Zm0 4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V13Z" clipRule="evenodd" />
    </svg>
  );
}

function CalendarDaysIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
    </svg>
  );
}

function CurrencyDollarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v1.036A4.5 4.5 0 0 0 5.5 8.25a.75.75 0 0 0 1.5 0 3 3 0 0 1 3-3v4.195l-.46.153a4.5 4.5 0 0 0-3.04 4.252 4.5 4.5 0 0 0 4.5 4.5v.4a.75.75 0 0 0 1.5 0v-.4a4.5 4.5 0 0 0 3.75-4.45.75.75 0 0 0-1.5 0 3 3 0 0 1-3 3V9.555l.46-.153a4.5 4.5 0 0 0 3.04-4.252A4.5 4.5 0 0 0 10.75 3.786V2.75Zm-2.25 8.528V6.82a3.003 3.003 0 0 1 1.5-.07v4.673a3.004 3.004 0 0 1-1.5-.145Zm3 1.917v4.672a3.004 3.004 0 0 1-1.5.07v-4.672a3.004 3.004 0 0 1 1.5-.07Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.777 11.777 0 0 0 1.039.573l.018.008.005.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
    </svg>
  );
}

function UserGroupIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.464 7.464 0 0 1 14.5 16Z" />
    </svg>
  );
}

export function InternshipDetailsPage() {
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');

  // Lookup internship by ID
  const internship = MOCK_INTERNSHIPS.find((item) => item.id === id);

  // Friendly 404 Not Found state for invalid IDs
  if (!internship) {
    return (
      <div className="py-12">
        <Card variant="bordered" padding="lg" className="max-w-lg mx-auto text-center bg-surface">
          <div className="w-14 h-14 rounded-2xl bg-danger-50 text-danger-500 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            404
          </div>
          <h1 className="text-xl font-bold text-text-primary">
            Internship Not Found
          </h1>
          <p className="text-xs text-text-secondary mt-2 mb-6 leading-relaxed">
            The internship listing you requested (ID: <code className="bg-secondary-100 px-1 py-0.5 rounded text-text-primary">{id}</code>) does not exist or may have been removed.
          </p>
          <Link to={ROUTES.STUDENT_INTERNSHIPS}>
            <Button variant="primary" size="md">
              <ArrowLeftIcon />
              <span>Back to All Internships</span>
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleToggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev;
      setSaveNotice(next ? 'Internship saved to your bookmarks!' : 'Internship removed from bookmarks.');
      setTimeout(() => setSaveNotice(''), 2500);
      return next;
    });
  };

  const handleDemoApply = (e) => {
    e.preventDefault();
    setApplicationSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Top Navigation Breadcrumb ── */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.STUDENT_INTERNSHIPS}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary-600 transition-colors"
        >
          <ArrowLeftIcon />
          <span>Back to all internships</span>
        </Link>
        <span className="text-xs text-text-muted">Listing ID: {internship.id}</span>
      </div>

      {/* ── Save Notification Toast ── */}
      {saveNotice && (
        <div
          role="status"
          className="p-3 bg-slate-900 text-white rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in"
        >
          <span className="w-2 h-2 rounded-full bg-primary-400" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* ── Main Hero Card ── */}
      <Card variant="bordered" padding="lg" className="bg-surface shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <Avatar name={internship.company} size="lg" className="shadow-xs shrink-0" />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
                  {internship.company}
                </span>
                <span>•</span>
                <span className="text-xs text-text-muted">{internship.category}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                {internship.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-text-secondary">
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon />
                  <span>{internship.location}</span>
                </span>
                <Badge variant={internship.workMode === 'Remote' ? 'success' : 'primary'} size="sm" dot>
                  {internship.workMode}
                </Badge>
                <Badge variant="default" size="sm">
                  {internship.type}
                </Badge>
                {internship.compensation && (
                  <span className="font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                    {internship.compensation}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            <Button
              variant={isSaved ? 'secondary' : 'outline'}
              size="md"
              onClick={handleToggleSave}
              className={isSaved ? 'text-primary-700 font-semibold' : ''}
            >
              <BookmarkIcon filled={isSaved} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setApplyModalOpen(true);
                setApplicationSubmitted(false);
              }}
              className="shadow-xs"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Content Grid: Two Columns (Left Details, Right Overview Sidebar) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Description, Responsibilities, Requirements, Benefits */}
        <div className="lg:col-span-2 space-y-6">
          {/* About the Role */}
          <Card variant="bordered" padding="md" className="bg-surface">
            <h2 className="text-base font-bold text-text-primary mb-3">
              About the Role
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {internship.description}
            </p>
          </Card>

          {/* Key Responsibilities */}
          <Card variant="bordered" padding="md" className="bg-surface">
            <h2 className="text-base font-bold text-text-primary mb-3">
              Key Responsibilities
            </h2>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              {internship.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Requirements & Qualifications */}
          {internship.requirements && (
            <Card variant="bordered" padding="md" className="bg-surface">
              <h2 className="text-base font-bold text-text-primary mb-3">
                Requirements & Qualifications
              </h2>
              <ul className="space-y-2.5 text-sm text-text-secondary">
                {internship.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 mt-2 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Required Skills */}
          <Card variant="bordered" padding="md" className="bg-surface">
            <h2 className="text-base font-bold text-text-primary mb-3">
              Required Skills & Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {internship.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg bg-primary-50 border border-primary-200/60 text-primary-800 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* Internship Perks & Benefits */}
          {internship.benefits && (
            <Card variant="bordered" padding="md" className="bg-surface">
              <h2 className="text-base font-bold text-text-primary mb-3">
                Perks & Benefits
              </h2>
              <ul className="space-y-2.5 text-sm text-text-secondary">
                {internship.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <CheckCircleIcon />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Right Column: Overview Card & Company Information */}
        <div className="space-y-6">
          {/* Quick Overview Snapshot */}
          <Card variant="bordered" padding="md" className="bg-surface space-y-4">
            <h3 className="text-sm font-bold text-text-primary pb-2 border-b border-border">
              Internship Overview
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <span className="p-1.5 rounded-lg bg-secondary-100 text-text-secondary shrink-0">
                  <CalendarDaysIcon />
                </span>
                <div>
                  <p className="text-text-muted font-medium">Application Deadline</p>
                  <p className="font-semibold text-text-primary mt-0.5">{internship.deadline}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="p-1.5 rounded-lg bg-secondary-100 text-text-secondary shrink-0">
                  <UserGroupIcon />
                </span>
                <div>
                  <p className="text-text-muted font-medium">Positions Available</p>
                  <p className="font-semibold text-text-primary mt-0.5">
                    {internship.positionsAvailable} {internship.positionsAvailable === 1 ? 'opening' : 'openings'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="p-1.5 rounded-lg bg-secondary-100 text-text-secondary shrink-0">
                  <CurrencyDollarIcon />
                </span>
                <div>
                  <p className="text-text-muted font-medium">Compensation</p>
                  <p className="font-semibold text-primary-700 mt-0.5">{internship.compensation}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="p-1.5 rounded-lg bg-secondary-100 text-text-secondary shrink-0">
                  <BuildingOfficeIcon />
                </span>
                <div>
                  <p className="text-text-muted font-medium">Work Arrangement</p>
                  <p className="font-semibold text-text-primary mt-0.5">
                    {internship.workMode} • {internship.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="p-1.5 rounded-lg bg-secondary-100 text-text-secondary shrink-0">
                  <CalendarDaysIcon />
                </span>
                <div>
                  <p className="text-text-muted font-medium">Duration & Cohort</p>
                  <p className="font-semibold text-text-primary mt-0.5">
                    {internship.duration} ({internship.type})
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  setApplyModalOpen(true);
                  setApplicationSubmitted(false);
                }}
              >
                Apply for this Role
              </Button>
            </div>
          </Card>

          {/* About Company Card */}
          <Card variant="bordered" padding="md" className="bg-surface space-y-3">
            <div className="flex items-center gap-3">
              <Avatar name={internship.company} size="md" />
              <div>
                <h4 className="font-bold text-sm text-text-primary">{internship.company}</h4>
                <p className="text-xs text-text-muted">{internship.location}</p>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {internship.companyDescription}
            </p>
            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
              <span>Verified Employer</span>
              <Badge variant="success" size="sm" dot>Active Hiring</Badge>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Demo Apply Modal Dialog ── */}
      {applyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-modal-title"
        >
          <div className="bg-surface rounded-2xl border border-border shadow-xl max-w-lg w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
              <div>
                <Badge variant="primary" size="sm" className="mb-1.5">Demo Interaction</Badge>
                <h3 id="apply-modal-title" className="text-lg font-bold text-text-primary">
                  Apply to {internship.title}
                </h3>
                <p className="text-xs text-text-muted">
                  {internship.company} • {internship.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-secondary-100"
                aria-label="Close apply dialog"
              >
                ✕
              </button>
            </div>

            {applicationSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-success-50 text-success-600 flex items-center justify-center mx-auto">
                  <CheckCircleIcon />
                </div>
                <h4 className="text-base font-bold text-text-primary">
                  Demo Application Registered!
                </h4>
                <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                  In this frontend demo mode, your interest in <strong>{internship.title}</strong> at <strong>{internship.company}</strong> has been simulated. No real email or submission was sent to the employer.
                </p>
                <div className="pt-3">
                  <Button variant="primary" size="md" onClick={() => setApplyModalOpen(false)}>
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDemoApply} className="space-y-4 text-xs">
                <div className="p-3 bg-secondary-50 border border-border rounded-xl text-text-secondary leading-relaxed">
                  👋 Your student profile (<strong>Sarah Chen</strong>, Stanford University) and uploaded resume will be attached to this application simulation.
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="cover-note" className="font-semibold text-text-primary block">
                    Why are you excited about this role? (Optional Note)
                  </label>
                  <textarea
                    id="cover-note"
                    rows={3}
                    placeholder="Briefly highlight relevant coursework, side projects, or interest in this team…"
                    className="w-full p-2.5 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setApplyModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="md">
                    Submit Demo Application
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InternshipDetailsPage;
