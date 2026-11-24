# Internship Platform

A full-stack internship management platform that connects students with companies. Students can discover opportunities and manage applications, companies can publish internships and review applicants, and administrators can oversee platform activity.

## Live Demo

- **Frontend:** https://internship-platform-frontend-five.vercel.app
- **Backend API:** https://internship-platform-backend.vercel.app

## Repositories

- **Frontend:** https://github.com/aymanechoukri/internship-platform-frontend
- **Backend:** https://github.com/aymanechoukri/internship-platform-backend

## Features

### Student portal
- Register and sign in with a student account
- Browse and search internship opportunities
- Filter opportunities and view internship details
- Submit applications and track application statuses
- View and update a student profile
- Upload, manage, and download a CV
- Receive platform notifications

### Company portal
- Register and manage a company profile
- Create, update, and manage internship listings
- View applicants for company opportunities
- Review applications and update their statuses
- Access applicant CVs where authorized
- Receive platform notifications

### Admin dashboard
- View platform statistics and recent activity
- Manage user accounts
- Review and verify company accounts
- Moderate internship listings
- Monitor applications
- Send notifications to platform users
- Review administrative activity logs

### Shared experience
- Role-based navigation for Student, Company, and Admin accounts
- Protected frontend routes and API authorization
- Responsive layouts for desktop and mobile
- Form validation, loading states, error feedback, and confirmation dialogs

## Tech Stack

| Frontend | Backend | Database & tooling |
| --- | --- | --- |
| React 19 | Node.js | MongoDB |
| React Router 7 | Express 5 | Mongoose |
| Vite 8 | JWT authentication | GitHub Actions |
| Tailwind CSS 4 | bcrypt password hashing | Vercel |
| JavaScript (ES modules) | Multer for CV uploads | ESLint |

## Architecture

The application is split into two repositories:

- The **React frontend** communicates with the backend through a shared API client.
- The **Express REST API** handles authentication, authorization, business logic, file operations, and database access.
- **MongoDB** stores users, student and company profiles, internships, applications, CV metadata, notifications, and admin activity records.

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm
- MongoDB instance or MongoDB Atlas connection string

### 1. Clone the repositories

```bash
git clone https://github.com/aymanechoukri/internship-platform-frontend.git
git clone https://github.com/aymanechoukri/internship-platform-backend.git
```

### 2. Configure and start the backend

```bash
cd internship-platform-backend
npm install
```

Create a `.env` file in the backend root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Use a strong, private JWT secret. Never commit the real `.env` file or expose database credentials.

Start the API:

```bash
npm run dev
```

The API runs locally on `http://localhost:5000` by default.

### 3. Configure and start the frontend

In a second terminal:

```bash
cd internship-platform-frontend
npm install
```

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite.

> Vite environment variables prefixed with `VITE_` are exposed to the browser. Do not store private keys, database credentials, or server secrets in them.

## Available Frontend Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create the production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Backend Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API |
| `npm test` | Run the Node.js test suite |

## Main API Areas

The REST API is organized around these resources:

- `/api/auth` — registration and authentication
- `/api/students` — student profiles
- `/api/companies` — company profiles and dashboard data
- `/api/internship` — internship discovery and listing management
- `/api/applications` — student applications and company reviews
- `/api/cvs` — CV upload and authorized downloads
- `/api/notifications` — user notifications
- `/api/admin` — administration and moderation

## Project Structure

### Frontend

```text
src/
├── components/   # Shared UI, layout, and feature components
├── constants/    # Routes, roles, and application constants
├── context/      # Authentication and feedback state
├── hooks/        # Reusable React hooks
├── layouts/      # Authentication and dashboard layouts
├── pages/        # Student, company, admin, and auth pages
├── routes/       # Role-protected route configuration
├── services/     # API client and resource services
├── styles/       # Global styles and design tokens
└── utils/        # Validation and formatting helpers
```

### Backend

```text
src/
├── config/       # Database configuration
├── middleware/   # Error handling and request middleware
├── models/       # Mongoose data models
├── modules/      # Auth, student, company, internship, CV, admin, and notification modules
├── utils/        # Shared utilities
├── app.js        # Express application and API routes
└── server.js     # Server startup
```

## Security Notes

- Passwords are hashed with bcrypt before storage.
- Authenticated API requests use signed JWTs.
- Backend authorization must be enforced for every protected operation; frontend route guards are for navigation and user experience only.
- CV access is handled through backend endpoints.
- Keep environment files and production credentials private.

## Project Status

The application is deployed and under active development. Some edge cases and workflows may still need further testing. Contributions and feedback are welcome.
