/**
 * @file pages/company/CompanyDashboard.jsx
 * @description Comprehensive Employer / Company Dashboard view.
 * Features recruiter welcome hero, 4 recruitment KPI cards, recent applicant pipeline table,
 * active internship listings section, and quick action to post a new internship.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Badge, Button, Card, Input } from '../../components/ui/index.js';
import {
  MOCK_COMPANY_APPLICATIONS,
  MOCK_COMPANY_POSTS,
  MOCK_COMPANY_PROFILE,
  MOCK_COMPANY_STATS,
} from '../../constants/mockCompanyDashboard.js';
import { ROUTES } from '../../constants/routes.js';

/* ── Inline SVG Icons ── */
function BriefcaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 0 1 8.75 1h2.5A2.75 2.75 0 0 1 14 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 0 1 6 4.193V3.75Zm4 6.25a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8.751 1h2.498a1.25 1.25 0 0 1 1.25 1.25v.31A42.524 42.524 0 0 0 10 2.5c-.868 0-1.72.04-2.56.118v-.368A1.25 1.25 0 0 1 8.751 1Z" clipRule="evenodd" />
      <path d="M3.396 12.957A37.457 37.457 0 0 0 10 14c2.26 0 4.44-.297 6.504-.853l.605 3.337A2.75 2.75 0 0 1 14.397 20H5.603a2.75 2.75 0 0 1-2.712-2.516l-.495-4.527z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.464 7.464 0 0 1 14.5 16Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
    </svg>
  );
}

export function CompanyDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [newPostSuccess, setNewPostSuccess] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postDept, setPostDept] = useState('');

  const getStatIcon = (iconName) => {
    switch (iconName) {
      case 'briefcase':
        return <BriefcaseIcon />;
      case 'users':
        return <UsersIcon />;
      case 'star':
        return <StarIcon />;
      case 'check':
        return <CheckBadgeIcon />;
      default:
        return <BriefcaseIcon />;
    }
  };

  const handleCreateMockPost = (e) => {
    e.preventDefault();
    if (!postTitle.trim()) return;

    setNewPostSuccess(true);
    setTimeout(() => {
      setModalOpen(false);
      setNewPostSuccess(false);
      setPostTitle('');
      setPostDept('');
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* ── Mock Data Banner Notification ── */}
      <div className="p-3 bg-primary-50/70 border border-primary-200/80 rounded-xl text-xs text-primary-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">Mock Data</Badge>
          <span>
            Viewing sample employer dashboard for <strong>{MOCK_COMPANY_PROFILE.companyName}</strong>. All candidate details and metrics are simulated.
          </span>
        </div>
        <Link
          to={ROUTES.STUDENT_DASHBOARD}
          className="text-primary-700 hover:text-primary-800 font-semibold underline underline-offset-2 shrink-0 hidden sm:inline"
        >
          View Student Dashboard →
        </Link>
      </div>

      {/* ── 1. Welcome Section & Main Quick Action ── */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Welcome, {MOCK_COMPANY_PROFILE.recruiterName.split(' ')[0]} 👋
            </h2>
            <Badge variant="success" dot size="sm">Company Verified</Badge>
          </div>
          <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
            {MOCK_COMPANY_PROFILE.companyName} currently has <strong className="text-text-primary">4 active internship postings</strong> with <strong className="text-primary-700 font-semibold">18 shortlisted candidates</strong> awaiting technical interviews.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-text-muted">
            <span className="font-medium text-text-secondary">{MOCK_COMPANY_PROFILE.recruiterRole}</span>
            <span>•</span>
            <span>{MOCK_COMPANY_PROFILE.industry}</span>
            <span>•</span>
            <span>{MOCK_COMPANY_PROFILE.headquarters}</span>
          </div>
        </div>

        {/* Quick Action CTA: Publish an Internship */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => setModalOpen(true)}
            className="shadow-xs"
          >
            <PlusIcon />
            <span>Post New Internship</span>
          </Button>
          <Link to={ROUTES.COMPANY_APPLICANTS}>
            <Button variant="outline" size="md">
              Review Applicants
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 2. Statistics Cards Grid (4 KPIs) ── */}
      <section aria-labelledby="company-kpi-heading">
        <h3 id="company-kpi-heading" className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
          Recruitment Pipeline
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_COMPANY_STATS.map((stat) => (
            <Card key={stat.id} variant="bordered" padding="md" className="hover:shadow-xs transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-text-secondary">{stat.label}</span>
                <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                  {getStatIcon(stat.icon)}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-text-primary tracking-tight">{stat.value}</p>
                <span
                  className={[
                    'text-xs font-medium',
                    stat.changeType === 'positive'
                      ? 'text-success-600'
                      : stat.changeType === 'primary'
                      ? 'text-primary-700 font-semibold'
                      : 'text-text-muted',
                  ].join(' ')}
                >
                  {stat.change}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 3. Recent Applications Section ── */}
      <section aria-labelledby="company-recent-applicants-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 id="company-recent-applicants-heading" className="text-base sm:text-lg font-bold text-text-primary">
              Recent Applications
            </h3>
            <p className="text-xs text-text-muted">
              Top candidates who recently applied to your open listings
            </p>
          </div>
          <Link
            to={ROUTES.COMPANY_APPLICANTS}
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View all 148 candidates</span>
            <ArrowRightIcon />
          </Link>
        </div>

        <div className="bg-surface border border-border rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary-50/70 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4 sm:px-6">Candidate</th>
                  <th scope="col" className="py-3 px-4">Role Applied</th>
                  <th scope="col" className="py-3 px-4 hidden md:table-cell">University & GPA</th>
                  <th scope="col" className="py-3 px-4">Applied Date</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {MOCK_COMPANY_APPLICATIONS.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-secondary-50/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <Avatar name={candidate.candidateName} size="sm" />
                        <div>
                          <p className="font-semibold text-text-primary text-xs sm:text-sm">
                            {candidate.candidateName}
                          </p>
                          <p className="text-xs text-text-muted hidden sm:block">
                            {candidate.degree}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-medium text-text-primary">
                        {candidate.roleApplied}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <p className="text-xs text-text-secondary">{candidate.university}</p>
                      <span className="text-[11px] font-semibold text-primary-700">
                        GPA: {candidate.gpa}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-text-secondary">
                      {candidate.appliedDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={candidate.badgeVariant} dot size="sm">
                        {candidate.statusLabel}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 4. Recent Internship Posts Section ── */}
      <section aria-labelledby="company-active-posts-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 id="company-active-posts-heading" className="text-base sm:text-lg font-bold text-text-primary">
              Active Internship Posts
            </h3>
            <p className="text-xs text-text-muted">
              Live roles accepting student applications
            </p>
          </div>
          <Link
            to={ROUTES.COMPANY_INTERNSHIPS}
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
          >
            <span>Manage listings ({MOCK_COMPANY_POSTS.length})</span>
            <ArrowRightIcon />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_COMPANY_POSTS.map((post) => (
            <Card key={post.id} variant="bordered" padding="md" className="flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-text-primary">
                      {post.title}
                    </h4>
                    <p className="text-xs text-text-muted mt-0.5">
                      {post.department} • {post.type}
                    </p>
                  </div>
                  <Badge variant={post.badgeVariant} dot size="sm">
                    {post.statusLabel}
                  </Badge>
                </div>

                <p className="text-xs text-text-secondary mb-4">
                  📍 {post.location}
                </p>

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-secondary-50 border border-border mb-4 text-xs">
                  <div>
                    <span className="text-[11px] text-text-muted block">Applicants</span>
                    <span className="text-sm font-bold text-text-primary">
                      {post.applicantsCount} candidates
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-text-muted block">Impressions</span>
                    <span className="text-sm font-semibold text-text-secondary flex items-center gap-1 mt-0.5">
                      <EyeIcon />
                      <span>{post.viewsCount} views</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-[11px] text-text-muted">Posted {post.postedDate}</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="primary" size="sm">
                    View Applicants
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 5. Quick Action Modal (Post New Internship) ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-surface rounded-2xl border border-border shadow-xl max-w-lg w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
              <div>
                <h3 id="modal-title" className="text-lg font-bold text-text-primary">
                  Post New Internship
                </h3>
                <p className="text-xs text-text-muted">
                  Quick action (Mock creation for demonstration)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-secondary-100"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {newPostSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-success-50 text-success-600 flex items-center justify-center mx-auto">
                  <CheckBadgeIcon />
                </div>
                <h4 className="text-base font-bold text-text-primary">
                  Internship Draft Created!
                </h4>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  &ldquo;{postTitle}&rdquo; has been added to your draft listings. (Frontend mock action).
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateMockPost} className="space-y-4">
                <Input
                  label="Internship Title"
                  placeholder="e.g. AI Research Intern"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  required
                />
                <Input
                  label="Department / Team"
                  placeholder="e.g. Machine Learning Systems"
                  value={postDept}
                  onChange={(e) => setPostDept(e.target.value)}
                  required
                />
                <div className="p-3 bg-secondary-50 border border-border rounded-lg text-xs text-text-muted">
                  ℹ️ This action creates a local simulation preview. Real submissions will communicate with the backend API in future phases.
                </div>
                <div className="flex items-center justify-end gap-3 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={!postTitle.trim()}
                  >
                    Publish Listing
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

export default CompanyDashboard;
