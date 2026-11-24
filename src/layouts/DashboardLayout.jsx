/**
 * @file layouts/DashboardLayout.jsx
 * @description Reusable SaaS dashboard layout for both Student and Company roles.
 * Includes responsive sidebar with active navigation states, topbar with search,
 * notifications, quick role switcher, mobile slide-over drawer, and profile menu.
 */

import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/index.js';
import { Avatar, Badge } from '../components/ui/index.js';
import { ROUTES } from '../constants/routes.js';
import { MOCK_COMPANY_PROFILE } from '../constants/mockCompanyDashboard.js';
import { MOCK_STUDENT_PROFILE } from '../constants/mockStudentDashboard.js';
import { getMyNotifications, markNotificationRead } from '../services/notificationService.js';

/* ── Inline SVG Icons ── */
function LogoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 text-white"
      aria-hidden="true"
    >
      <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.24.09-.364.09a.755.755 0 0 1-.364-.09l-.003-.001A49.95 49.95 0 0 0 2.1 10.057a.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
      <path d="M13.06 15.473a48.455 48.455 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.726 19.824 19.824 0 0 1-8.521 1.799 19.824 19.824 0 0 1-8.522-1.8.75.75 0 0 1-.459-.724c.035-1.442.121-2.87.255-4.285a48.455 48.455 0 0 1 7.666 3.282.75.75 0 0 0 .62 0Z" />
      <path d="M20.25 10.332v9.918a.75.75 0 0 1-1.5 0v-8.82a50.764 50.764 0 0 0-6.75 2.574V21a.75.75 0 0 1-1.5 0v-6.996a50.75 50.75 0 0 0-6.75-2.574v8.82a.75.75 0 0 1-1.5 0v-9.918a48.48 48.48 0 0 1 8.25 3.324 48.48 48.48 0 0 1 8.25-3.324Z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z" clipRule="evenodd" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 0 1 8.75 1h2.5A2.75 2.75 0 0 1 14 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 0 1 6 4.193V3.75Zm4 6.25a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8.751 1h2.498a1.25 1.25 0 0 1 1.25 1.25v.31A42.524 42.524 0 0 0 10 2.5c-.868 0-1.72.04-2.56.118v-.368A1.25 1.25 0 0 1 8.751 1Z" clipRule="evenodd" />
      <path d="M3.396 12.957A37.457 37.457 0 0 0 10 14c2.26 0 4.44-.297 6.504-.853l.605 3.337A2.75 2.75 0 0 1 14.397 20H5.603a2.75 2.75 0 0 1-2.712-2.516l-.495-4.527Z" />
    </svg>
  );
}

function DocumentTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
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

function UserCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6ZM10 18a3 3 0 0 1-2.83-2h5.66A3 3 0 0 1 10 18Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function XMarkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function ArrowRightOnRectangleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l2.483-2.482a.75.75 0 1 0-1.06-1.06l-3.75 3.75a.75.75 0 0 0 0 1.06l3.75 3.75a.75.75 0 1 0 1.06-1.06L8.704 10.75H18.25A.75.75 0 0 0 19 10Z" clipRule="evenodd" />
    </svg>
  );
}

export function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [companyNotifications, setCompanyNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Detect whether current route is student or company
  const isCompany = location.pathname.startsWith('/company');

  // Active navigation definitions based on role
  const navigationItems = isCompany
    ? [
        { label: 'Dashboard', to: ROUTES.COMPANY_DASHBOARD, icon: <GridIcon />, badge: null },
        { label: 'Manage Internships', to: ROUTES.COMPANY_INTERNSHIPS, icon: <BriefcaseIcon />, badge: null },
        { label: 'Applicants', to: ROUTES.COMPANY_APPLICANTS, icon: <UsersIcon />, badge: null },
        { label: 'Company Profile', to: ROUTES.COMPANY_PROFILE, icon: <UserCircleIcon />, badge: null },
      ]
    : [
        { label: 'Dashboard', to: ROUTES.STUDENT_DASHBOARD, icon: <GridIcon />, badge: null },
        { label: 'Browse Internships', to: ROUTES.STUDENT_INTERNSHIPS, icon: <BriefcaseIcon />, badge: null },
        { label: 'My Applications', to: ROUTES.STUDENT_APPLICATIONS, icon: <DocumentTextIcon />, badge: null },
        { label: 'My CV', to: ROUTES.STUDENT_CV, icon: <DocumentTextIcon />, badge: null },
        { label: 'My Profile', to: ROUTES.STUDENT_PROFILE, icon: <UserCircleIcon />, badge: null },
      ];

  useEffect(() => {
    if (!user) return undefined;
    let active = true;
    getMyNotifications().then((result) => {
      if (!active) return;
      setCompanyNotifications(result.notifications || []);
      setUnreadNotifications(result.unreadCount || 0);
    }).catch(() => {});
    return () => { active = false; };
  }, [isCompany, user?._id]);

  const handleNotification = async (notification) => {
    if (notification.isRead) return;
    try {
      await markNotificationRead(notification._id);
      setCompanyNotifications((current) => current.map((item) => item._id === notification._id ? { ...item, isRead: true } : item));
      setUnreadNotifications((count) => Math.max(0, count - 1));
    } catch {
      // Keep the notification unread when the API request fails.
    }
  };

  const currentProfile = isCompany
    ? {
        name: user?.fullName ?? user?.name ?? MOCK_COMPANY_PROFILE.recruiterName,
        subtitle: user?.companyName ?? user?.company?.name ?? MOCK_COMPANY_PROFILE.companyName,
        roleBadge: 'Company',
        roleBadgeVariant: 'primary',
      }
    : {
        name: user?.fullName ?? user?.name ?? MOCK_STUDENT_PROFILE.fullName,
        subtitle: user?.university ?? user?.school ?? MOCK_STUDENT_PROFILE.university,
        roleBadge: 'Student',
        roleBadgeVariant: 'info',
      };

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const handleSignOut = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      {/* ── Mobile Sidebar Drawer Backdrop ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar (Desktop Fixed + Mobile Off-Canvas) ── */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-auto',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-border flex items-center justify-between">
          <Link
            to={isCompany ? ROUTES.COMPANY_DASHBOARD : ROUTES.STUDENT_DASHBOARD}
            onClick={closeMobileMenu}
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
          >
            <span className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-xs">
              <LogoIcon />
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-text-primary text-sm tracking-tight leading-none">
                InternPlatform
              </span>
              <span className="text-[10px] text-text-muted font-medium tracking-wide">
                {isCompany ? 'Employer Portal' : 'Student Hub'}
              </span>
            </div>
          </Link>

          <button
            type="button"
            className="md:hidden p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-secondary-100"
            onClick={closeMobileMenu}
            aria-label="Close sidebar"
          >
            <XMarkIcon />
          </button>
        </div>

        {/* Role Indicator & Quick View Switcher */}
        <div className="px-4 py-3 bg-secondary-50 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-text-secondary">Mode:</span>
            <Badge variant={currentProfile.roleBadgeVariant} size="sm">
              {currentProfile.roleBadge}
            </Badge>
          </div>
          <span className="text-[11px] font-medium text-text-muted">Authenticated session</span>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Main Menu
          </div>
          {navigationItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                [
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors select-none',
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold shadow-2xs'
                    : 'text-text-secondary hover:text-text-primary hover:bg-secondary-100',
                ].join(' ')}
            >
              <div className="flex items-center gap-3">
                <span className="text-inherit">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary-100 text-primary-700">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-3 border-t border-border bg-surface">
          <div className="flex items-center justify-between p-2 rounded-lg bg-secondary-50 border border-border">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar name={currentProfile.name} size="sm" />
              <div className="truncate">
                <p className="text-xs font-semibold text-text-primary truncate">
                  {currentProfile.name}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  {currentProfile.subtitle}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="p-1.5 text-text-muted hover:text-danger-500 rounded transition-colors"
              title="Sign out"
              aria-label="Sign out"
            >
              <ArrowRightOnRectangleIcon />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main View Container ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Topbar ── */}
        <header className="h-16 bg-surface border-b border-border px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open sidebar menu"
            >
              <MenuIcon />
            </button>

            {/* Breadcrumb / Title */}
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight leading-none">
                {isCompany ? 'Company Portal' : 'Student Portal'}
              </h1>
              <p className="text-xs text-text-muted mt-0.5 hidden sm:block">
                {isCompany
                  ? 'Manage job postings, review applicants, and track talent acquisition'
                  : 'Track applications, view status updates, and discover new roles'}
              </p>
            </div>
          </div>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="relative hidden sm:block w-48 lg:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder={isCompany ? 'Search applicants, roles…' : 'Search internships, skills…'}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-secondary-50 text-xs text-text-primary placeholder:text-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen((prev) => !prev);
                  setProfileMenuOpen(false);
                }}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary-100 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
                aria-label="View notifications"
              >
                <BellIcon />
                {unreadNotifications > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-600 ring-2 ring-white" />}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-surface rounded-xl shadow-lg border border-border py-2 z-50">
                  <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-primary">Notifications</span>
                    <span className="text-[10px] bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded-full font-bold">{unreadNotifications} unread</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-border text-xs">
                    {companyNotifications.map((notification) => (
                      <button key={notification._id} type="button" onClick={() => handleNotification(notification)} className={`block w-full px-4 py-3 text-left hover:bg-secondary-50 ${notification.isRead ? "opacity-70" : "bg-primary-50/40"}`}>
                        <p className="font-semibold text-text-primary">{notification.title}</p>
                        <p className="text-text-secondary text-[11px] mt-0.5">{notification.content}</p>
                        <span className="text-[10px] text-text-muted mt-1 block">{notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ""}{notification.isRead ? " · Read" : " · Mark as read"}</span>
                      </button>
                    ))}
                    {companyNotifications.length === 0 && <div className="px-4 py-5 text-center text-xs text-text-muted">You're all caught up.</div>}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Menu Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen((prev) => !prev);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-secondary-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <Avatar name={currentProfile.name} size="sm" />
                <span className="text-xs font-semibold text-text-primary hidden md:inline">
                  {currentProfile.name.split(' ')[0]}
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-lg border border-border py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-xs font-semibold text-text-primary">{currentProfile.name}</p>
                    <p className="text-[11px] text-text-muted truncate">{currentProfile.subtitle}</p>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2 text-xs text-danger-500 hover:bg-red-50 font-medium text-left"
                    >
                      <ArrowRightOnRectangleIcon />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page Content Area ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
