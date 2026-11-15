/**
 * @file constants/routes.js
 * @description Application route path constants.
 * Centralises all route strings — prevents hard-coded paths across the codebase.
 */

export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Student
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_PROFILE: '/student/profile',
  STUDENT_APPLICATIONS: '/student/applications',
  STUDENT_SEARCH: '/student/search',

  // Company
  COMPANY_DASHBOARD: '/company/dashboard',
  COMPANY_PROFILE: '/company/profile',
  COMPANY_INTERNSHIPS: '/company/internships',
  COMPANY_APPLICANTS: '/company/applicants',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_COMPANIES: '/admin/companies',
};
