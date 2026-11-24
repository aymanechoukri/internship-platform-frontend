import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar, Badge, Button, Card } from "../../components/ui/index.js";
import { ROUTES } from "../../constants/routes.js";
import useLocalStorage from "../../hooks/useLocalStorage.js";
import { applyForInternship, getMyApplications } from "../../services/applicationService.js";
import { getInternshipById } from "../../services/internshipService.js";
import { useFeedback } from "../../context/FeedbackContext.jsx";

export function InternshipDetailsPage() {
  const { notify } = useFeedback();
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [savedIds, setSavedIds] = useLocalStorage("saved-internships", []);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      getInternshipById(id),
      getMyApplications().catch(() => []),
    ])
      .then(([listing, applications]) => {
        if (!active) return;
        setInternship(listing);
        setAlreadyApplied(applications.some((item) => String(item.internship?._id || item.internship) === String(id)));
      })
      .catch((err) => { if (active) setError(err.message || "Internship not found."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const isSaved = savedIds.includes(id);
  const expired = internship?.deadline && new Date(internship.deadline).getTime() < Date.now();
  const companyName = internship?.company?.companyName || internship?.company?.user?.name || "Verified company";

  const toggleSaved = () => {
    const wasSaved = savedIds.includes(id);
    setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    notify(wasSaved ? "Internship removed from saved items." : "Internship saved successfully.", "success");
  };

  const handleApply = async () => {
    setApplying(true); setError(""); setNotice("");
    try {
      await applyForInternship(id);
      setAlreadyApplied(true);
      notify("Your application has been submitted successfully.", "success");
    } catch (err) {
      setError(err.message || "Unable to submit your application.");
    } finally { setApplying(false); }
  };

  if (loading) return <p className="py-12 text-center text-sm text-text-secondary">Loading internship details…</p>;
  if (!internship) return (
    <Card padding="lg" className="mx-auto max-w-xl text-center">
      <h1 className="text-xl font-bold text-text-primary">Internship unavailable</h1>
      <p className="mt-2 text-sm text-text-secondary">{error || "This opportunity may have expired or been removed."}</p>
      <Link to={ROUTES.STUDENT_INTERNSHIPS}><Button className="mt-5">Back to internships</Button></Link>
    </Card>
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link to={ROUTES.STUDENT_INTERNSHIPS} className="text-sm font-semibold text-primary-600">← Back to internships</Link>
      {error && <p role="alert" className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">{error}</p>}
      
      <Card padding="lg" className="space-y-5">
        <div className="flex flex-col justify-between gap-5 sm:flex-row">
          <div className="flex items-start gap-4"><Avatar name={companyName} size="xl" /><div><p className="text-sm font-semibold text-primary-700">{companyName}</p><h1 className="mt-1 text-2xl font-bold text-text-primary">{internship.title}</h1><p className="mt-2 text-sm text-text-secondary">{internship.location || "Location not specified"} · {internship.type} · {internship.duration || "Duration not specified"}</p></div></div>
          <div className="flex items-start gap-2"><Button variant="outline" onClick={toggleSaved}>{isSaved ? "Saved" : "Save"}</Button><Button onClick={handleApply} disabled={applying || alreadyApplied || expired}>{applying ? "Submitting…" : alreadyApplied ? "Already applied" : expired ? "Deadline passed" : "Apply now"}</Button></div>
        </div>
        <div className="flex flex-wrap gap-2"><Badge variant="success">Verified company</Badge><Badge variant="primary">{internship.type}</Badge><Badge>{Number(internship.salary || 0) > 0 ? `${Number(internship.salary).toLocaleString()} MAD` : "Compensation not specified"}</Badge></div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card padding="lg"><h2 className="mb-3 text-lg font-bold text-text-primary">About this internship</h2><p className="whitespace-pre-line text-sm leading-7 text-text-secondary">{internship.description}</p></Card>
          <Card padding="lg"><h2 className="mb-3 text-lg font-bold text-text-primary">Required skills</h2><div className="flex flex-wrap gap-2">{(internship.skills || []).map((skill) => <Badge key={skill}>{skill}</Badge>)}{!internship.skills?.length && <p className="text-sm text-text-muted">No specific skills listed.</p>}</div></Card>
        </div>
        <Card padding="lg" className="h-fit space-y-4">
          <h2 className="text-base font-bold text-text-primary">Overview</h2>
          <div><p className="text-xs text-text-muted">Location</p><p className="mt-1 text-sm font-medium text-text-primary">{internship.location || "Not specified"}</p></div>
          <div><p className="text-xs text-text-muted">Work mode</p><p className="mt-1 text-sm font-medium text-text-primary">{internship.type}</p></div>
          <div><p className="text-xs text-text-muted">Duration</p><p className="mt-1 text-sm font-medium text-text-primary">{internship.duration || "Not specified"}</p></div>
          <div><p className="text-xs text-text-muted">Application deadline</p><p className="mt-1 text-sm font-medium text-text-primary">{internship.deadline ? new Date(internship.deadline).toLocaleDateString() : "Not specified"}</p></div>
          <div><p className="text-xs text-text-muted">Company website</p>{internship.company?.website ? <a className="mt-1 block break-all text-sm text-primary-600 underline" href={internship.company.website} target="_blank" rel="noreferrer">{internship.company.website}</a> : <p className="mt-1 text-sm text-text-primary">Not provided</p>}</div>
          <Button fullWidth onClick={handleApply} disabled={applying || alreadyApplied || expired}>{applying ? "Submitting…" : alreadyApplied ? "Already applied" : expired ? "Deadline passed" : "Apply for this internship"}</Button>
          {alreadyApplied && <p className="text-xs text-success-700">You can follow your application in <Link className="underline" to={ROUTES.STUDENT_APPLICATIONS}>My Applications</Link>.</p>}
        </Card>
      </div>
    </div>
  );
}

export default InternshipDetailsPage;
