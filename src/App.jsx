import { AuthProvider } from './context/AuthContext.jsx';
import { Avatar, Badge, Button, Card, Input, Spinner } from './components/ui/index.js';

/**
 * @file App.jsx
 * @description Temporary design system preview (Task 4).
 * Will be replaced by the router and actual pages in future tasks.
 */

/* ── Icon helpers (inline SVG, no icon library) ── */
function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
      <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
    </svg>
  );
}

/* ── Section wrapper ── */
function Section({ title, children }) {
  return (
    <section className="mb-12">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-5 pb-2 border-b border-border">
        {title}
      </h2>
      {children}
    </section>
  );
}

function DesignSystemPreview() {
  return (
    <div className="min-h-screen bg-bg">
      {/* ── Top bar ── */}
      <header className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm4 6.25a1 1 0 100-2 1 1 0 000 2zM8.751 1h2.498a1.25 1.25 0 011.25 1.25v.31A42.524 42.524 0 0010 2.5c-.868 0-1.72.04-2.56.118v-.368A1.25 1.25 0 018.751 1z" clipRule="evenodd" />
                <path d="M3.396 12.957A37.457 37.457 0 0010 14c2.26 0 4.44-.297 6.504-.853l.605 3.337A2.75 2.75 0 0114.397 20H5.603a2.75 2.75 0 01-2.712-2.516l-.495-4.527z" />
              </svg>
            </span>
            <span className="font-semibold text-text-primary text-sm">Internship Platform</span>
          </div>
          <Badge variant="primary" size="sm">Design System Preview</Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Typography ── */}
        <Section title="Typography">
          <div className="flex flex-col gap-3">
            <p className="text-4xl font-bold text-text-primary leading-tight">Page Title — Find Your Internship</p>
            <p className="text-2xl font-semibold text-text-primary">Section Heading — Featured Opportunities</p>
            <p className="text-lg font-medium text-text-primary">Sub-heading — Software Engineering Intern</p>
            <p className="text-base text-text-secondary">Body text — We are looking for motivated students to join our engineering team this summer. You will work on real projects alongside senior engineers.</p>
            <p className="text-sm text-text-muted">Small label — Posted 3 days ago · Remote · 3–6 months</p>
            <p className="text-xs font-medium uppercase tracking-widest text-text-muted">Overline — Featured Companies</p>
          </div>
        </Section>

        {/* ── Buttons ── */}
        <Section title="Buttons">
          <div className="flex flex-col gap-6">
            {/* Variants */}
            <div>
              <p className="text-xs text-text-muted mb-3">Variants</p>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary">Apply Now</Button>
                <Button variant="secondary">Save Job</Button>
                <Button variant="outline">View Profile</Button>
                <Button variant="ghost">Learn More</Button>
                <Button variant="danger">Withdraw</Button>
              </div>
            </div>
            {/* Sizes */}
            <div>
              <p className="text-xs text-text-muted mb-3">Sizes</p>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            {/* States */}
            <div>
              <p className="text-xs text-text-muted mb-3">States</p>
              <div className="flex flex-wrap gap-3 items-center">
                <Button isLoading>Submitting…</Button>
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>Disabled Outline</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Inputs ── */}
        <Section title="Inputs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            <Input
              label="Job title or keyword"
              placeholder="e.g. Software Engineer"
              leftIcon={<SearchIcon />}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@university.edu"
              leftIcon={<MailIcon />}
            />
            <Input
              label="Company name"
              placeholder="e.g. Acme Corp"
              helperText="Start typing to search all registered companies"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              error="Password must be at least 8 characters"
            />
            <Input
              label="Location"
              placeholder="City, country or Remote"
              size="sm"
            />
            <Input
              label="Duration"
              placeholder="e.g. 3–6 months"
              size="lg"
            />
          </div>
        </Section>

        {/* ── Badges ── */}
        <Section title="Badges">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Accepted</Badge>
              <Badge variant="warning">Under Review</Badge>
              <Badge variant="danger">Rejected</Badge>
              <Badge variant="info">New</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" dot>Open</Badge>
              <Badge variant="warning" dot>Closing Soon</Badge>
              <Badge variant="danger" dot>Closed</Badge>
              <Badge variant="primary" dot>Featured</Badge>
            </div>
          </div>
        </Section>

        {/* ── Avatars ── */}
        <Section title="Avatars">
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs text-text-muted mb-3">With initials</p>
              <div className="flex items-center gap-3">
                <Avatar name="Alice Johnson" size="xs" />
                <Avatar name="Bob Smith" size="sm" />
                <Avatar name="Clara Evans" size="md" />
                <Avatar name="David Park" size="lg" />
                <Avatar name="Eva Martinez" size="xl" />
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-3">With image</p>
              <div className="flex items-center gap-3">
                <Avatar src="https://i.pravatar.cc/32?img=1"  alt="User 1" size="sm" />
                <Avatar src="https://i.pravatar.cc/40?img=5"  alt="User 2" size="md" />
                <Avatar src="https://i.pravatar.cc/48?img=9"  alt="User 3" size="lg" />
                <Avatar src="https://i.pravatar.cc/64?img=12" alt="User 4" size="xl" />
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-3">Fallback (no name, no image)</p>
              <div className="flex items-center gap-3">
                <Avatar size="sm" />
                <Avatar size="md" />
                <Avatar size="lg" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── Spinner ── */}
        <Section title="Spinner">
          <div className="flex flex-wrap items-center gap-6">
            <div className="text-center">
              <Spinner size="sm" />
              <p className="text-xs text-text-muted mt-2">sm</p>
            </div>
            <div className="text-center">
              <Spinner size="md" />
              <p className="text-xs text-text-muted mt-2">md</p>
            </div>
            <div className="text-center">
              <Spinner size="lg" />
              <p className="text-xs text-text-muted mt-2">lg</p>
            </div>
            <div className="text-center">
              <Spinner size="xl" />
              <p className="text-xs text-text-muted mt-2">xl</p>
            </div>
          </div>
        </Section>

        {/* ── Cards ── */}
        <Section title="Cards">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Internship listing card */}
            <Card hoverable>
              <Card.Header>
                <div className="flex items-center gap-3">
                  <Avatar name="Google" size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Google</p>
                    <p className="text-xs text-text-muted">Mountain View, CA</p>
                  </div>
                </div>
                <Badge variant="success" dot size="sm">Open</Badge>
              </Card.Header>
              <Card.Body>
                <h3 className="text-base font-semibold text-text-primary mb-1">
                  Software Engineer Intern
                </h3>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  Work on large-scale distributed systems powering Google's core products.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default" size="sm">Full-time</Badge>
                  <Badge variant="default" size="sm">3 months</Badge>
                  <Badge variant="default" size="sm">Paid</Badge>
                </div>
              </Card.Body>
              <Card.Footer>
                <span className="text-xs text-text-muted">Posted 2 days ago</span>
                <Button size="sm">Apply</Button>
              </Card.Footer>
            </Card>

            {/* Application status card */}
            <Card variant="raised">
              <Card.Header>
                <p className="text-sm font-semibold text-text-primary">Your Application</p>
                <Badge variant="warning" dot>Under Review</Badge>
              </Card.Header>
              <Card.Body>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name="Meta" size="md" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Product Design Intern</p>
                    <p className="text-xs text-text-muted">Meta · Remote</p>
                  </div>
                </div>
                <div className="bg-bg rounded-lg p-3 text-xs text-text-secondary">
                  Your application is being reviewed by the hiring team. You'll hear back within 5–7 business days.
                </div>
              </Card.Body>
              <Card.Footer>
                <span className="text-xs text-text-muted">Applied Jan 12, 2025</span>
                <Button variant="ghost" size="sm">View Details</Button>
              </Card.Footer>
            </Card>

            {/* Stats card */}
            <Card variant="bordered">
              <Card.Header>
                <p className="text-sm font-semibold text-text-primary">Platform Stats</p>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Open Listings', value: '1,284' },
                    { label: 'Companies', value: '340' },
                    { label: 'Students', value: '8,900' },
                    { label: 'Placements', value: '2,100' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-bg rounded-lg p-3">
                      <p className="text-xl font-bold text-primary-600">{value}</p>
                      <p className="text-xs text-text-muted mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        </Section>

        {/* ── Design Tokens ── */}
        <Section title="Color Palette">
          <div className="flex flex-col gap-4">
            {[
              {
                label: 'Primary (Indigo)',
                swatches: [
                  { name: '50',  cls: 'bg-primary-50' },
                  { name: '100', cls: 'bg-primary-100' },
                  { name: '200', cls: 'bg-primary-200' },
                  { name: '300', cls: 'bg-primary-300' },
                  { name: '400', cls: 'bg-primary-400' },
                  { name: '500', cls: 'bg-primary-500' },
                  { name: '600', cls: 'bg-primary-600' },
                  { name: '700', cls: 'bg-primary-700' },
                  { name: '800', cls: 'bg-primary-800' },
                  { name: '900', cls: 'bg-primary-900' },
                ],
              },
              {
                label: 'Secondary (Slate)',
                swatches: [
                  { name: '50',  cls: 'bg-secondary-50' },
                  { name: '100', cls: 'bg-secondary-100' },
                  { name: '200', cls: 'bg-secondary-200' },
                  { name: '300', cls: 'bg-secondary-300' },
                  { name: '400', cls: 'bg-secondary-400' },
                  { name: '500', cls: 'bg-secondary-500' },
                  { name: '600', cls: 'bg-secondary-600' },
                  { name: '700', cls: 'bg-secondary-700' },
                  { name: '800', cls: 'bg-secondary-800' },
                  { name: '900', cls: 'bg-secondary-900' },
                ],
              },
            ].map(({ label, swatches }) => (
              <div key={label}>
                <p className="text-xs text-text-muted mb-2">{label}</p>
                <div className="flex rounded-lg overflow-hidden border border-border h-10">
                  {swatches.map(({ name, cls }) => (
                    <div
                      key={name}
                      className={`flex-1 ${cls}`}
                      title={`${label} ${name}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

      </main>

      <footer className="border-t border-border bg-surface mt-10">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
          <p className="text-xs text-text-muted">Internship Platform — Design System Preview (Task 4)</p>
          <Badge variant="primary" size="sm">v0.4.0</Badge>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DesignSystemPreview />
    </AuthProvider>
  );
}

