# Internship Platform

A responsive internship management platform built with React, React Router, Vite, and Tailwind CSS v4. The project currently provides a frontend prototype for students and employers, with mock data used for dashboard and workflow demonstrations.

## Features

### Student portal
- Student dashboard with application overview and recommendations
- Internship discovery with keyword search, category, location, work-mode, and type filters
- Sorting by newest and compensation
- Internship detail pages
- Saved internships persisted in browser storage
- Internship application demo flow
- Dedicated applications history with status filters
- Editable student profile (browser-local persistence)

### Employer portal
- Company dashboard with recruitment metrics and sample applicant activity
- Internship listing management
- Create, edit, filter, and delete internship posts (browser-local persistence)
- Applicant search and status updates
- Editable company profile (browser-local persistence)
- Form validation and delete confirmation

### Authentication UI
- Login, registration, and password-reset screens
- Student and company account type selection
- Client-side validation and password visibility controls

### UI foundation
- Shared Button, Input, Card, Badge, Avatar, and Spinner components
- Tailwind CSS v4 design tokens
- Responsive dashboard and authentication layouts

## Tech stack

- React 19
- React Router 7
- Vite 8
- Tailwind CSS 4
- ESLint

## Getting started

Requirements: Node.js 20.19+ or 22.12+ (compatible with Vite 8), plus npm.

```bash
git clone https://github.com/aymanechoukri/internship-platform-frontend.git
cd internship-platform-frontend
npm install
npm run dev
```

Open the local URL printed by Vite.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```text
src/
├── components/
│   ├── company/       # Employer modals and forms
│   ├── layout/        # Shared layout exports
│   └── ui/            # Reusable UI components
├── constants/         # Routes, roles, and prototype data
├── context/           # Shared authentication state
├── hooks/             # Reusable React hooks
├── layouts/           # Authentication and dashboard layouts
├── pages/
│   ├── auth/          # Login, registration, password reset
│   ├── company/       # Employer portal
│   └── student/       # Student portal
├── routes/            # Central route configuration
├── services/          # API client and service layer
├── styles/            # Fonts and global styles
└── utils/             # Validators and formatters
```

## Current implementation status

This repository is currently a **frontend prototype**, not a production-connected full-stack application.

- Login, registration, and password-reset forms call the API service layer. The frontend expects the backend endpoints documented below; the backend itself is not included in this repository.
- Authenticated student and company routes are protected by client-side role guards. API authorization must still be enforced by the backend.
- Dashboard metrics and initial profiles/applicants/internships are sample data.
- Internship create/edit/delete operations, saved jobs, applications, profile edits, and applicant status changes are persisted only in the current browser using localStorage.
- The application flow is a local prototype: it does not upload a resume, send email, or notify an employer.
- The admin route provides an explicit placeholder only. User, company, and platform administration screens are not implemented.
- A GitHub Actions workflow runs ESLint and the Vite production build on pushes and pull requests.

## Backend integration

The API client reads its base URL from `VITE_API_URL` and falls back to `http://localhost:8080/api`.

The current authentication service expects these JSON endpoints:

| Method | Endpoint | Expected response |
| --- | --- | --- |
| POST | `/auth/login` | `{ "token": "...", "user": { "role": "student" or "company" } }` |
| POST | `/auth/register` | Account creation result |
| POST | `/auth/forgot-password` | Password-reset request result |
| POST | `/auth/logout` | Logout result (optional for local session clearing) |

The login parser also accepts `accessToken`, `access_token`, or a nested `data.token` and `data.user` response. Adjust the service layer to match your actual backend contract before deployment. Route guards in React improve navigation UX but do not replace backend authorization.

Create a local `.env` file when a backend is available:

```env
VITE_API_URL=http://localhost:8080/api
```

Do not put private API keys or server secrets in Vite environment variables prefixed with `VITE_`; those values are exposed to the browser.

## Roadmap

- Confirm the real backend request/response contract and test authentication end to end.
- Replace browser-local demo persistence with database-backed internship, bookmark, application, profile, and applicant endpoints.
- Add resume upload, employer notifications, and application status history.
- Implement real admin user/company moderation and platform management.
- Add automated unit and integration tests for validation, routing, and core user flows.

## Project status

Work in progress. Demo data and simulated interactions are labelled in the interface where applicable.
