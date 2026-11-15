/**
 * @file constants/mockInternships.js
 * @description Rich mock dataset of internships for student discovery and details.
 * Completely frontend mock data — not connected to backend.
 */

export const MOCK_INTERNSHIPS = [
  {
    id: 'int-01',
    title: 'Frontend Engineering Intern',
    company: 'Stripe',
    companyLogo: '',
    companyDescription:
      'Stripe is a financial infrastructure platform for businesses. Millions of companies use Stripe to accept payments, grow their revenue, and accelerate new business opportunities.',
    category: 'Software Engineering',
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    type: 'Summer 2025',
    duration: '12 weeks',
    compensation: '$55/hr',
    deadline: '2025-06-15',
    postedDate: '2025-05-10',
    positionsAvailable: 3,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'GraphQL', 'Web Performance'],
    description:
      'As a Frontend Engineering Intern on the Dashboard team, you will build user-facing financial software used by millions of merchants worldwide. You will partner with designers and backend engineers to craft seamless, accessible, and ultra-fast web experiences.',
    responsibilities: [
      'Design, build, and deploy new components for the core Stripe Merchant Dashboard.',
      'Collaborate with Product Designers to refine design specifications and implement pixel-perfect user interfaces.',
      'Optimize application bundles and client-side rendering performance.',
      'Write comprehensive unit and integration tests using Jest and React Testing Library.',
      'Participate in team code reviews, design discussions, and sprint planning.',
    ],
    requirements: [
      'Currently pursuing a BS or MS in Computer Science, Software Engineering, or related field with expected graduation in 2026.',
      'Demonstrated proficiency in JavaScript / TypeScript and modern frontend frameworks like React.',
      'Understanding of HTML5, CSS3, modern layout techniques (Flexbox, Grid), and responsive design principles.',
      'Strong problem-solving abilities and communication skills.',
    ],
    benefits: [
      'Competitive hourly compensation with housing stipend or relocation assistance.',
      '1-on-1 mentorship from Senior and Staff Software Engineers.',
      'Comprehensive health insurance coverage during the internship period.',
      'Regular team social events, hackathons, and executive speaker series.',
    ],
  },
  {
    id: 'int-02',
    title: 'AI Platform Engineering Intern',
    company: 'Anthropic',
    companyLogo: '',
    companyDescription:
      'Anthropic is an AI safety and research company that builds reliable, beneficial, and steerable AI systems.',
    category: 'Data & AI',
    location: 'San Francisco, CA',
    workMode: 'On-site',
    type: 'Summer 2025',
    duration: '14 weeks',
    compensation: '$62/hr',
    deadline: '2025-06-20',
    postedDate: '2025-05-12',
    positionsAvailable: 2,
    skills: ['Python', 'PyTorch', 'LLMs', 'Distributed Systems', 'FastAPI'],
    description:
      'Join Anthropic to build the high-throughput computing platforms and inference infrastructure powering state-of-the-art language models. You will tackle novel scalability challenges in distributed model evaluation and safety fine-tuning.',
    responsibilities: [
      'Develop scalable pipelines for model alignment, safety evaluation, and automated benchmarking.',
      'Optimize distributed GPU cluster utilization and model inference latencies.',
      'Work alongside research scientists to implement exploratory model evaluation techniques.',
      'Build internal monitoring dashboards for tracking training stability and inference metrics.',
    ],
    requirements: [
      'Enrolled in Computer Science, Machine Learning, or Computational Mathematics program.',
      'Strong proficiency in Python and familiarity with PyTorch or JAX.',
      'Understanding of distributed computing concepts and GPU workloads.',
      'Passion for responsible and safe AI development.',
    ],
    benefits: [
      'Industry-leading compensation and full housing accommodation.',
      'Direct contribution to cutting-edge frontier AI safety initiatives.',
      'Daily catered meals and comprehensive wellness benefits.',
    ],
  },
  {
    id: 'int-03',
    title: 'Product Design Intern',
    company: 'Figma',
    companyLogo: '',
    companyDescription:
      'Figma is the leading collaborative interface design tool. We make design accessible, collaborative, and fun for teams worldwide.',
    category: 'Product Design',
    location: 'Remote',
    workMode: 'Remote',
    type: 'Summer 2025',
    duration: '12 weeks',
    compensation: '$48/hr',
    deadline: '2025-06-01',
    postedDate: '2025-05-08',
    positionsAvailable: 2,
    skills: ['Figma', 'UI/UX', 'Design Systems', 'User Research', 'Prototyping'],
    description:
      'We are looking for a creative, detail-oriented Product Design Intern to help invent new collaborative design patterns. You will own features from exploratory concept sketches to final engineering handoff.',
    responsibilities: [
      'Produce wireframes, user flows, and interactive high-fidelity prototypes for emerging collaboration features.',
      'Conduct qualitative user interviews and synthesize feedback into actionable product improvements.',
      'Contribute to and evolve the Figma design token and component library.',
      'Work closely with Product Managers and Frontend Engineers to ensure design intent is fully realized in production.',
    ],
    requirements: [
      'Pursuing a degree in HCI, Graphic Design, Digital Media, or equivalent practical portfolio experience.',
      'A strong design portfolio showcasing end-to-end product thinking, interaction design, and visual polish.',
      'Fluency in Figma and rapid prototyping techniques.',
      'Deep curiosity for user behavior and collaborative workflows.',
    ],
    benefits: [
      'Fully remote flexibility with home office setup stipend ($1,000).',
      'Dedicated design mentor and regular portfolio reviews with Principal Designers.',
      'Figma merchandise kit and software subscription perks.',
    ],
  },
  {
    id: 'int-04',
    title: 'Full Stack Developer Intern',
    company: 'Datadog',
    companyLogo: '',
    companyDescription:
      'Datadog is an observability and security platform for cloud applications. We provide monitoring of servers, databases, tools, and services through a SaaS-based data analytics platform.',
    category: 'Software Engineering',
    location: 'New York, NY',
    workMode: 'Hybrid',
    type: 'Full-time',
    duration: '12 weeks',
    compensation: '$50/hr',
    deadline: '2025-06-10',
    postedDate: '2025-05-04',
    positionsAvailable: 4,
    skills: ['Go', 'TypeScript', 'React', 'PostgreSQL', 'Docker'],
    description:
      'Datadog is seeking a Full Stack Developer Intern to contribute to our core observability dashboard. You will build high-performance data visualization tools that process millions of metrics per second.',
    responsibilities: [
      'Build end-to-end features spanning Go backend microservices and React frontend dashboards.',
      'Optimize database queries and caching layers for sub-second chart rendering.',
      'Design clean REST and gRPC API contracts.',
      'Resolve real-time bug reports and participate in rotational incident debriefs.',
    ],
    requirements: [
      'CS student graduating late 2025 or 2026.',
      'Experience with both a backend language (Go, Python, Java) and JavaScript/TypeScript.',
      'Familiarity with SQL relational databases and modern web architectures.',
    ],
    benefits: [
      'Competitive pay with corporate housing in Manhattan.',
      'Subsidized transit pass and wellness gym membership.',
      'High conversion rate to full-time new graduate offers.',
    ],
  },
  {
    id: 'int-05',
    title: 'Product Management Intern',
    company: 'Linear',
    companyLogo: '',
    companyDescription:
      'Linear is the purpose-built tool for modern software teams to streamline issues, sprints, and product roadmaps with unmatched speed and craftsmanship.',
    category: 'Product Management',
    location: 'Remote',
    workMode: 'Remote',
    type: 'Summer 2025',
    duration: '12 weeks',
    compensation: '$52/hr',
    deadline: '2025-05-30',
    postedDate: '2025-04-28',
    positionsAvailable: 1,
    skills: ['Product Strategy', 'Roadmapping', 'User Analytics', 'Technical Writing', 'Agile'],
    description:
      'Work alongside Linear’s founders and product leads to define, validate, and launch the next generation of project planning features. You will analyze user metrics, draft product specs, and drive cross-functional execution.',
    responsibilities: [
      'Synthesize user feedback from customer community channels into prioritized feature proposals.',
      'Write clear, concise product specifications and track launch milestones.',
      'Analyze product engagement metrics to measure the adoption of newly launched capabilities.',
      'Collaborate directly with designers and engineers to resolve scope trade-offs.',
    ],
    requirements: [
      'Enrolled in University with interest in product management, tech entrepreneurship, or software delivery.',
      'Exceptional written communication and narrative articulation skills.',
      'Basic technical literacy to speak credibly with software engineers.',
    ],
    benefits: [
      '100% remote workspace with full home office allowance.',
      'Direct mentorship from industry-renowned product leaders.',
      'Access to team retreats and all-company offsites.',
    ],
  },
  {
    id: 'int-06',
    title: 'Cloud Infrastructure & DevOps Intern',
    company: 'CloudScale Technologies',
    companyLogo: '',
    companyDescription:
      'CloudScale Technologies builds next-generation multi-cloud orchestrators and enterprise Kubernetes automation platforms.',
    category: 'DevOps & Cloud',
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    type: 'Summer 2025',
    duration: '12 weeks',
    compensation: '$52/hr',
    deadline: '2025-06-30',
    postedDate: '2025-05-02',
    positionsAvailable: 2,
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Linux', 'Bash', 'CI/CD'],
    description:
      'Get hands-on experience orchestrating production container clusters across AWS and GCP. You will help build automated canary release pipelines, infrastructure-as-code templates, and disaster recovery automations.',
    responsibilities: [
      'Write automated infrastructure configurations using Terraform and Helm.',
      'Improve CI/CD build speeds and container vulnerability scanning stages.',
      'Assist in incident response simulations and observability tuning.',
      'Document cloud governance best practices and standard operating procedures.',
    ],
    requirements: [
      'Undergraduate or Graduate student in Computer Science, Systems Engineering, or IT.',
      'Familiarity with Linux command line environments and containerization basics (Docker).',
      'Eagerness to learn cloud architectures (AWS, GCP, Azure).',
    ],
    benefits: [
      'Mentorship from Principal Site Reliability Engineers.',
      'Paid AWS and Kubernetes certification voucher programs.',
      'Competitive compensation and catered team lunches.',
    ],
  },
  {
    id: 'int-07',
    title: 'Data Science & Analytics Intern',
    company: 'Spotify',
    companyLogo: '',
    companyDescription:
      'Spotify is the world’s most popular audio streaming subscription service with 600M+ users across 180+ markets.',
    category: 'Data & AI',
    location: 'Boston, MA',
    workMode: 'Hybrid',
    type: 'Summer 2025',
    duration: '10 weeks',
    compensation: '$46/hr',
    deadline: '2025-06-05',
    postedDate: '2025-04-22',
    positionsAvailable: 3,
    skills: ['Python', 'SQL', 'A/B Testing', 'Tableau', 'Pandas', 'Statistics'],
    description:
      'Join the Content Personalization group to uncover insights that shape the music recommendation algorithms for millions of listeners. You will design experimentation frameworks and build automated reporting dashboards.',
    responsibilities: [
      'Analyze large-scale listener interaction telemetry using SQL and BigQuery.',
      'Design and analyze statistical significance of A/B test experiments for algorithm changes.',
      'Develop interactive executive dashboards in Tableau and Python.',
      'Present research findings to product and marketing decision-makers.',
    ],
    requirements: [
      'Degree in Statistics, Data Science, Economics, Mathematics, or Computer Science.',
      'Proficiency in SQL query optimization and Python data libraries (Pandas, NumPy).',
      'Solid grounding in hypothesis testing and experimental design.',
    ],
    benefits: [
      'Free Spotify Premium account and concert ticket discounts.',
      'Hybrid office setup in downtown Boston overlooking the harbor.',
      'Relocation assistance or housing stipend provided.',
    ],
  },
  {
    id: 'int-08',
    title: 'Mobile App Developer Intern (iOS/Android)',
    company: 'Airbnb',
    companyLogo: '',
    companyDescription:
      'Airbnb is a community based on connection and belonging—a community that was born in 2008 when two hosts welcomed three guests to their San Francisco home.',
    category: 'Software Engineering',
    location: 'San Francisco, CA',
    workMode: 'On-site',
    type: 'Summer 2025',
    duration: '12 weeks',
    compensation: '$58/hr',
    deadline: '2025-06-18',
    postedDate: '2025-05-11',
    positionsAvailable: 2,
    skills: ['Swift', 'Kotlin', 'React Native', 'Mobile UI', 'GraphQL'],
    description:
      'Contribute to one of the most celebrated consumer mobile applications. You will work on traveler booking flows, host messaging, and smooth animated checkout transitions.',
    responsibilities: [
      'Develop native mobile UI flows in Swift (iOS) or Kotlin (Android).',
      'Collaborate with animation and design teams to create delightful 60fps micro-interactions.',
      'Integrate GraphQL client queries and implement offline-first caching.',
      'Perform device compatibility and performance testing.',
    ],
    requirements: [
      'CS student with demonstrable iOS, Android, or React Native project experience.',
      'Understanding of mobile design guidelines (Apple Human Interface / Material Design).',
      'Strong grasp of data structures, memory management, and asynchronous networking.',
    ],
    benefits: [
      '$2,000 annual Airbnb travel credit for all interns.',
      'Full corporate housing accommodation in San Francisco.',
      'Dedicated mentor and career development workshops.',
    ],
  },
  {
    id: 'int-09',
    title: 'Growth Marketing & Community Intern',
    company: 'Notion',
    companyLogo: '',
    companyDescription:
      'Notion is the connected workspace where better, faster work happens. We believe that everyone should be able to tailor tools to their specific problems.',
    category: 'Marketing',
    location: 'New York, NY',
    workMode: 'Hybrid',
    type: 'Fall 2025',
    duration: '16 weeks',
    compensation: '$40/hr',
    deadline: '2025-07-01',
    postedDate: '2025-05-01',
    positionsAvailable: 2,
    skills: ['Content Strategy', 'Social Media', 'Community Building', 'Copywriting', 'SEO'],
    description:
      'Help grow Notion’s global student ambassador program and campus communities. You will produce engaging social content, organize student workshops, and draft product tutorials.',
    responsibilities: [
      'Coordinate campus ambassador meetups and virtual template-building challenges.',
      'Draft student-centric productivity guides and blog content.',
      'Track engagement analytics across social channels and community forums.',
      'Provide customer feedback loops back to the core marketing team.',
    ],
    requirements: [
      'Enrolled in University; Marketing, Communications, English, or related major.',
      'Super-user of Notion with a passion for productivity workflows.',
      'Strong creative writing and visual storytelling abilities.',
    ],
    benefits: [
      'Notion merchandise and lifetime workspace upgrade.',
      'Mentorship from Notion’s viral growth and community team leads.',
      'Flexible semester hours accommodating university class schedule.',
    ],
  },
];

export const INTERNSHIP_CATEGORIES = [
  'All',
  'Software Engineering',
  'Product Design',
  'Product Management',
  'Data & AI',
  'DevOps & Cloud',
  'Marketing',
];

export const WORK_MODES = ['All', 'Remote', 'Hybrid', 'On-site'];

export const INTERNSHIP_TYPES = ['All', 'Summer 2025', 'Fall 2025', 'Full-time', 'Part-time', 'Co-op'];

export const POPULAR_LOCATIONS = [
  'All',
  'San Francisco, CA',
  'New York, NY',
  'Remote',
  'Boston, MA',
];
