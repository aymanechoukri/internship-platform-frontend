# Internship Platform

A responsive internship management platform built with React, React Router, Vite, and Tailwind CSS v4. The project currently provides a frontend prototype for students and employers, with mock data used for dashboard and workflow demonstrations.

## Features

### Student portal
- Student dashboard with application overview and recommendations
- Internship discovery with keyword search, category, location, work-mode, and type filters
- Sorting by newest and compensation
- Internship detail pages
- Saved internship interactions
- Demo application flow

### Employer portal
- Company dashboard with recruitment metrics and sample applicant activity
- Internship listing management
- Create, edit, filter, and delete internship posts (in-memory demo state)
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

- Authentication screens validate input locally; they do not authenticate against a server yet.
- Dashboard metrics, profiles, internships, and applicants use sample data.
- Internship create/edit/delete operations currently update React state only and are not persisted.
- The apply flow is explicitly simulated; no application is sent to an employer.
- API client and authentication service foundations exist, but the UI workflows are not yet wired to a confirmed backend contract.
- Admin routes/screens, dedicated profile management, and a complete applicant review workflow remain future work.

## Backend integration

The API client reads its base URL from `VITE_API_URL` and falls back to `http://localhost:8080/api`.

Create a local `.env` file when a backend is available:

```env
VITE_API_URL=http://localhost:8080/api
```

Do not put private API keys or server secrets in Vite environment variables prefixed with `VITE_`; those values are exposed to the browser.

## Roadmap

- Connect login and registration to the backend and restore the authenticated session.
- Add protected routes and role-based access control.
- Persist internships and saved items through API endpoints.
- Build student applications and employer applicant review workflows.
- Add student/company profile pages and admin management.
- Add automated tests for validation, routing, and core user flows.

## Project status

Work in progress. Demo data and simulated interactions are labelled in the interface where applicable.
