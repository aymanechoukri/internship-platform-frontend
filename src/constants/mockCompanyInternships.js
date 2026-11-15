/**
 * @file constants/mockCompanyInternships.js
 * @description Mock data for Company Internship Management.
 * Preloaded with realistic postings for CloudScale Technologies.
 * Supports in-memory Create, Edit, and Delete actions in component state.
 */

export const INITIAL_COMPANY_INTERNSHIPS = [
  {
    id: 'post-101',
    title: 'Frontend Developer Intern',
    category: 'Software Engineering',
    department: 'Product Engineering',
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    type: 'Summer 2025',
    duration: '12 weeks',
    compensation: '$52/hr',
    deadline: '2025-06-30',
    createdAt: '2025-04-15',
    applicationsCount: 64,
    positions: 2,
    status: 'active',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    description:
      'We are looking for an enthusiastic Frontend Developer Intern to join our Cloud Management Portal team. You will build user-friendly interfaces that empower DevOps teams to manage multi-cloud clusters.',
    responsibilities:
      'Develop modern web applications using React and Tailwind CSS.\nCollaborate with backend engineers to integrate REST and GraphQL APIs.\nWrite automated component tests and ensure web accessibility standards.',
  },
  {
    id: 'post-102',
    title: 'Backend Engineering Intern',
    category: 'Software Engineering',
    department: 'Platform & Infra',
    location: 'San Francisco, CA',
    workMode: 'On-site',
    type: 'Summer 2025',
    duration: '12 weeks',
    compensation: '$55/hr',
    deadline: '2025-06-15',
    createdAt: '2025-04-18',
    applicationsCount: 48,
    positions: 3,
    status: 'active',
    skills: ['Go', 'Kubernetes', 'gRPC', 'PostgreSQL', 'Docker'],
    description:
      'Work on the distributed control plane that schedules and provisions cloud workloads across AWS, GCP, and Azure. Solve challenging problems in consensus, state synchronization, and low-latency networking.',
    responsibilities:
      'Build scalable microservices in Go and gRPC.\nImprove database indexing and query latency for large telemetry datasets.\nParticipate in architecture reviews and code audits.',
  },
  {
    id: 'post-103',
    title: 'Product Management Intern',
    category: 'Product Management',
    department: 'Growth & Core',
    location: 'New York, NY',
    workMode: 'Hybrid',
    type: 'Summer 2025',
    duration: '12 weeks',
    compensation: '$48/hr',
    deadline: '2025-06-20',
    createdAt: '2025-04-25',
    applicationsCount: 26,
    positions: 1,
    status: 'active',
    skills: ['Product Strategy', 'User Research', 'SQL', 'Roadmapping'],
    description:
      'Help guide customer onboarding and product-led growth initiatives. You will conduct user interviews with enterprise platform engineers and analyze funnel telemetry to recommend UX enhancements.',
    responsibilities:
      'Define product requirements and acceptance criteria for new developer portal features.\nAnalyze user engagement cohorts using Mixpanel and SQL.\nWork closely with sales engineers to identify common customer friction points.',
  },
  {
    id: 'post-104',
    title: 'DevOps & Site Reliability Intern',
    category: 'DevOps & Cloud',
    department: 'Site Reliability',
    location: 'Remote',
    workMode: 'Remote',
    type: 'Fall 2025',
    duration: '16 weeks',
    compensation: '$50/hr',
    deadline: '2025-07-15',
    createdAt: '2025-05-01',
    applicationsCount: 10,
    positions: 2,
    status: 'draft',
    skills: ['Terraform', 'AWS', 'Linux', 'GitHub Actions', 'Prometheus'],
    description:
      'Learn how to manage multi-region Kubernetes clusters with zero-downtime updates. You will implement automated alerting, create infrastructure as code modules, and optimize CI build times.',
    responsibilities:
      'Author Terraform modules for reusable cloud infrastructure deployment.\nMaintain Prometheus and Grafana alerting configurations.\nAutomate security vulnerability scanning in container images.',
  },
  {
    id: 'post-105',
    title: 'UI/UX Design Intern (Design Systems)',
    category: 'Product Design',
    department: 'Design',
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    type: 'Summer 2025',
    duration: '12 weeks',
    compensation: '$45/hr',
    deadline: '2025-05-01',
    createdAt: '2025-03-10',
    applicationsCount: 42,
    positions: 1,
    status: 'closed',
    skills: ['Figma', 'Design Systems', 'Prototyping', 'User Testing'],
    description:
      'Help expand our enterprise design system components and token architecture. This position has completed hiring for the 2025 cohort.',
    responsibilities:
      'Designed reusable Figma component variants with comprehensive documentation.\nConducted usability testing sessions with internal cloud engineers.\nAudited color contrast and accessibility across the product suite.',
  },
];
