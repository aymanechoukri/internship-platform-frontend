import { useEffect, useState } from "react";
import { Badge, Button, Card } from "../../components/ui/index.js";
import useAuth from "../../hooks/useAuth.js";
import { createCompanyProfile, getCompanyProfile, updateCompanyProfile } from "../../services/companyService.js";
import { useFeedback } from "../../context/FeedbackContext.jsx";

const EMPTY_PROFILE = { companyName: "", website: "", location: "", industry: "", description: "" };

export function CompanyProfilePage() {\n  const { notify } = useFeedback();
  const { user } = useAuth();
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    getCompanyProfile()
      .then((data) => {
        if (!active) return;
        setProfile({
          companyName: data.companyName || "",
          website: data.website || "",
          location: data.location || "",
          industry: data.industry || "",
          description: data.description || "",
          verificationStatus: data.verificationStatus || "pending",
          rejectionReason: data.rejectionReason || "",
        });
        setExists(true);
      })
      .catch((err) => {
        if (!active) return;
        if (/not found/i.test(err.message)) setExists(false);
        else setError(err.message || "Unable to load company profile.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);
    const payload = {
      companyName: profile.companyName.trim(),
      website: profile.website.trim(),
      location: profile.location.trim(),
      industry: profile.industry.trim(),
      description: profile.description.trim(),
    };
    try {
      const data = exists ? await updateCompanyProfile(payload) : await createCompanyProfile(payload);
      setExists(true);
      setProfile((current) => ({ ...current, ...data }));
      notify("Company profile saved successfully.", "success");
    } catch (err) {
      setError(err.message || "Unable to save company profile.");\n      notify(err.message || "Unable to save company profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-sm text-text-secondary">Loading company profile…</p>;

  const status = profile.verificationStatus || "pending";
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Company profile</h1>
        <p className="mt-1 text-sm text-text-secondary">Update the information reviewed by the platform administrator.</p>
      </div>
      {error && <p role="alert" className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">{error}</p>}
      <Card padding="lg" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="font-semibold text-text-primary">{profile.companyName || "New company profile"}</h2><p className="text-xs text-text-muted">{user?.email}</p></div>
          {exists && <Badge variant={status === "approved" ? "success" : status === "rejected" ? "danger" : "warning"}>{status}</Badge>}
        </div>
        {exists && status === "rejected" && profile.rejectionReason && <p className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">Administrator feedback: {profile.rejectionReason}</p>}
        {exists && status === "pending" && <p className="text-xs text-text-secondary">Your company is waiting for verification. Changes to the profile may require a new review.</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="text-sm font-medium text-text-secondary">Company name<input name="companyName" required minLength={2} maxLength={120} value={profile.companyName} onChange={handleChange} className="mt-1 h-10 w-full rounded-lg border border-border px-3 text-sm text-text-primary" /></label>
          <label className="text-sm font-medium text-text-secondary">Website<input name="website" type="url" placeholder="https://example.com" value={profile.website} onChange={handleChange} className="mt-1 h-10 w-full rounded-lg border border-border px-3 text-sm text-text-primary" /></label>
          <label className="text-sm font-medium text-text-secondary">Location<input name="location" maxLength={120} value={profile.location} onChange={handleChange} className="mt-1 h-10 w-full rounded-lg border border-border px-3 text-sm text-text-primary" /></label>
          <label className="text-sm font-medium text-text-secondary">Industry<input name="industry" maxLength={100} value={profile.industry} onChange={handleChange} className="mt-1 h-10 w-full rounded-lg border border-border px-3 text-sm text-text-primary" /></label>
          <label className="sm:col-span-2 text-sm font-medium text-text-secondary">Company description<textarea name="description" rows={5} maxLength={2000} value={profile.description} onChange={handleChange} className="mt-1 w-full rounded-lg border border-border p-3 text-sm text-text-primary" /></label>
          <div className="sm:col-span-2 flex items-center justify-between gap-3">
            
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : exists ? "Save changes" : "Create company profile"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CompanyProfilePage;
