import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Badge, Button, Card } from "../../components/ui/index.js";
import { ROUTES } from "../../constants/routes.js";
import useLocalStorage from "../../hooks/useLocalStorage.js";
import { getInternships } from "../../services/internshipService.js";

const formatSalary = (value) => Number(value || 0) > 0 ? `${Number(value).toLocaleString()} MAD` : "Not specified";

export function StudentInternshipsPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [skill, setSkill] = useState("");
  const [savedIds, setSavedIds] = useLocalStorage("saved-internships", []);
  const [internships, setInternships] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getInternships({ search, location, type, skill, page: 1, limit: 30 })
      .then((result) => {
        if (!active) return;
        setInternships(result.internships);
        setPagination(result.pagination);
      })
      .catch((err) => { if (active) setError(err.message || "Unable to load internships."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [search, location, type, skill]);

  const toggleSaved = (id) => {
    setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const clearFilters = () => { setSearch(""); setLocation(""); setType(""); setSkill(""); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div><h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Explore internships</h1><p className="mt-1 text-sm text-text-secondary">Discover active opportunities from administrator-verified companies.</p></div>
        <Badge variant="primary">{pagination.total ?? internships.length} opportunities</Badge>
      </div>

      <Card padding="md" className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <label className="text-xs font-semibold text-text-secondary md:col-span-2">Search title or description
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. React developer" className="mt-1.5 h-10 w-full rounded-lg border border-border px-3 text-sm font-normal text-text-primary" />
          </label>
          <label className="text-xs font-semibold text-text-secondary">Location
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Casablanca" className="mt-1.5 h-10 w-full rounded-lg border border-border px-3 text-sm font-normal text-text-primary" />
          </label>
          <label className="text-xs font-semibold text-text-secondary">Work mode
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-border bg-white px-3 text-sm font-normal text-text-primary">
              <option value="">All modes</option><option value="Remote">Remote</option><option value="Onsite">On-site</option><option value="Hybrid">Hybrid</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-xs font-semibold text-text-secondary">Skill
            <input value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="e.g. JavaScript" className="ml-2 h-9 rounded-lg border border-border px-3 text-sm font-normal text-text-primary" />
          </label>
          <Button type="button" variant="outline" size="sm" onClick={clearFilters}>Clear filters</Button>
        </div>
      </Card>

      {error && <p role="alert" className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">{error}</p>}
      {loading ? <p className="py-10 text-center text-sm text-text-secondary">Loading opportunities…</p> : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {internships.map((item) => {
            const companyName = item.company?.companyName || item.company?.user?.name || "Verified company";
            const isSaved = savedIds.includes(item._id);
            return (
              <Card key={item._id} padding="md" className="flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3"><Avatar name={companyName} size="md" /><div className="min-w-0"><p className="truncate text-sm font-semibold text-text-primary">{companyName}</p><p className="text-xs text-text-muted">{item.location || "Location not specified"}</p></div></div>
                    <button type="button" onClick={() => toggleSaved(item._id)} aria-label={isSaved ? "Remove saved internship" : "Save internship"} aria-pressed={isSaved} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-secondary-50">{isSaved ? "Saved" : "Save"}</button>
                  </div>
                  <h2 className="mt-4 text-lg font-bold text-text-primary">{item.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-secondary">{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2"><Badge variant="primary">{item.type}</Badge><Badge>{item.duration || "Duration not specified"}</Badge><Badge variant="success">{formatSalary(item.salary)}</Badge></div>
                  <div className="mt-3 flex flex-wrap gap-1.5">{(item.skills || []).slice(0, 6).map((value) => <span key={value} className="rounded-md bg-secondary-100 px-2 py-1 text-[11px] text-secondary-700">{value}</span>)}</div>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-text-muted">{item.deadline ? `Deadline: ${new Date(item.deadline).toLocaleDateString()}` : "No deadline specified"}</span>
                  <Link to={ROUTES.STUDENT_INTERNSHIP_DETAILS.replace(":id", item._id)}><Button size="sm">View details</Button></Link>
                </div>
              </Card>
            );
          })}
          {!internships.length && <div className="rounded-xl border border-dashed border-border p-10 text-center md:col-span-2"><h2 className="font-semibold text-text-primary">No opportunities found</h2><p className="mt-1 text-sm text-text-secondary">Try changing your search or filters.</p></div>}
        </div>
      )}
    </div>
  );
}

export default StudentInternshipsPage;
