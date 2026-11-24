/**
 * @file pages/student/StudentDashboard.jsx
 * @description Comprehensive Student Dashboard view.
 * Features personalized welcome hero, 4 KPI stats cards, recent applications tracking table,
 * recommended internships cards, and quick browsing action.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Badge, Button, Card } from '../../components/ui/index.js';
import {
  MOCK_RECOMMENDED_INTERNSHIPS,
  MOCK_STUDENT_APPLICATIONS,
  MOCK_STUDENT_PROFILE,
  MOCK_STUDENT_STATS,
} from '../../constants/mockStudentDashboard.js';
import { ROUTES } from '../../constants/routes.js';

/* ── Inline SVG Icons ── */
function DocumentCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm4.75 6.75a.75.75 0 0 1 1.5 0v2.546l.943-.943a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 1 1 1.06-1.06l.947.947V8.75Z" clipRule="evenodd" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
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

function XCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a8.03 8.03 0 0 1-6.19 6.19l-1.19.24a1 1 0 0 0 0 1.96l1.19.24a8.03 8.03 0 0 1 6.19 6.19l.24 1.19a1 1 0 0 0 1.96 0l.24-1.19a8.03 8.03 0 0 1 6.19-6.19l1.19-.24a1 1 0 0 0 0-1.96l-1.19-.24a8.03 8.03 0 0 1-6.19-6.19l-.24-1.192ZM4.444 14.288a.75.75 0 0 0-1.47 0l-.13.65a4.015 4.015 0 0 1-3.09 3.09l-.65.13a.75.75 0 0 0 0 1.47l.65.13a4.015 4.015 0 0 1 3.09 3.09l.13.65a.75.75 0 0 0 1.47 0l.13-.65a4.015 4.015 0 0 1 3.09-3.09l.65-.13a.75.75 0 0 0 0-1.47l-.65-.13a4.015 4.015 0 0 1-3.09-3.09l-.13-.65Z" />
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

export function StudentDashboard() {
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatIcon = (iconName) => {
    switch (iconName) {
      case 'document':
        return <DocumentCheckIcon />;
      case 'clock':
        return <ClockIcon />;
      case 'check':
        return <CheckBadgeIcon />;
      case 'x':
        return <XCircleIcon />;
      default:
        return <DocumentCheckIcon />;
    }
  };

  const filteredApplications =
    filterStatus === 'all'
      ? MOCK_STUDENT_APPLICATIONS
      : MOCK_STUDENT_APPLICATIONS.filter((app) => app.status === filterStatus);

  return (
    <div className="space-y-8">
      {/* ── Mock Data Banner Notification ── */}
      <div className="p-3 bg-primary-50/70 border border-primary-200/80 rounded-xl text-xs text-primary-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">Mock Data</Badge>
          <span>
            Viewing sample student dashboard. Backend connection will be established in upcoming tasks.
          </span>
        </div>
        <Link
          to={ROUTES.STUDENT_INTERNSHIPS}
          className="text-primary-700 hover:text-primary-800 font-semibold underline underline-offset-2 shrink-0 hidden sm:inline"
        >
          Browse Internships →
        </Link>
      </div>

      {/* ── 1. Personalized Welcome Section ── */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Welcome back, {MOCK_STUDENT_PROFILE.fullName.split(' ')[0]}! 👋
            </h2>
          </div>
          <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
            You have <strong className="text-text-primary">5 active applications</strong> under review and <strong className="text-primary-700 font-semibold">2 new interview updates</strong> waiting for your attention.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-text-muted">
            <span className="font-medium text-text-secondary">{MOCK_STUDENT_PROFILE.university}</span>
            <span>•</span>
            <span>{MOCK_STUDENT_PROFILE.degree}</span>
            <span>•</span>
            <span>Class of {MOCK_STUDENT_PROFILE.graduationYear}</span>
          </div>
        </div>

        {/* Quick Actions CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to={ROUTES.STUDENT_SEARCH}>
            <Button variant="primary" size="md" className="shadow-xs">
              <SparklesIcon />
              <span>Browse Internships</span>
            </Button>
          </Link>
          <Link to={ROUTES.STUDENT_APPLICATIONS}>
            <Button variant="outline" size="md">
              View All Applications
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 2. Statistics Cards Grid (4 KPIs) ── */}
      <section aria-labelledby="student-kpi-heading">
        <h3 id="student-kpi-heading" className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
          Application Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_STUDENT_STATS.map((stat) => (
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
                    stat.changeType === 'positive' ? 'text-success-600' : 'text-text-muted',
                  ].join(' ')}
                >
                  {stat.change}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 3. Recent Applications Table/List ── */}
      <section aria-labelledby="recent-applications-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 id="recent-applications-heading" className="text-base sm:text-lg font-bold text-text-primary">
              Recent Applications
            </h3>
            <p className="text-xs text-text-muted">
              Track real-time status changes and interview stages
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-secondary-100 rounded-lg text-xs font-medium self-start sm:self-auto">
            {['all', 'under_review', 'accepted', 'rejected'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={[
                  'px-2.5 py-1 rounded-md transition-colors capitalize select-none',
                  filterStatus === status
                    ? 'bg-white text-text-primary font-semibold shadow-2xs'
                    : 'text-text-muted hover:text-text-primary',
                ].join(' ')}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List / Table Container */}
        <div className="bg-surface border border-border rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary-50/70 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4 sm:px-6">Role & Company</th>
                  <th scope="col" className="py-3 px-4 hidden md:table-cell">Location & Compensation</th>
                  <th scope="col" className="py-3 px-4">Applied Date</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-secondary-50/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <Avatar name={app.companyName} size="sm" />
                        <div>
                          <p className="font-semibold text-text-primary text-xs sm:text-sm">
                            {app.internshipTitle}
                          </p>
                          <p className="text-xs text-text-muted font-medium">
                            {app.companyName}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <p className="text-xs text-text-secondary">{app.location}</p>
                      <p className="text-[11px] text-text-muted">{app.stipend}</p>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-text-secondary">
                      {app.appliedDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={app.badgeVariant} dot size="sm">
                        {app.statusLabel}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-border bg-secondary-50/40 text-center">
            <Link
              to={ROUTES.STUDENT_APPLICATIONS}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1.5"
            >
              <span>View all 12 submitted applications</span>
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. Recommended Internships Section ── */}
      <section aria-labelledby="recommended-internships-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 id="recommended-internships-heading" className="text-base sm:text-lg font-bold text-text-primary">
              Recommended for You
            </h3>
            <p className="text-xs text-text-muted">
              Matches based on your profile, skills, and major
            </p>
          </div>
          <Link
            to={ROUTES.STUDENT_SEARCH}
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
          >
            <span>Explore all (140+)</span>
            <ArrowRightIcon />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MOCK_RECOMMENDED_INTERNSHIPS.map((item) => (
            <Card key={item.id} variant="bordered" padding="md" hoverable className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={item.company} size="sm" />
                    <div>
                      <h4 className="text-xs font-bold text-text-primary">{item.company}</h4>
                      <p className="text-[11px] text-text-muted">{item.location}</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    {item.matchScore}% Match
                  </Badge>
                </div>

                <h5 className="font-semibold text-sm text-text-primary mb-2 line-clamp-1">
                  {item.title}
                </h5>

                <div className="space-y-1.5 text-xs text-text-secondary mb-4">
                  <p className="text-text-muted text-[11px]">{item.type} • {item.duration}</p>
                  <p className="font-semibold text-primary-700">{item.stipend}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-secondary-100 text-secondary-700 text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-[11px] text-warning-600 font-medium">{item.deadline}</span>
                <Link to={ROUTES.STUDENT_INTERNSHIPS}>
                  <Button variant="primary" size="sm">
                    View & Apply
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default StudentDashboard;
