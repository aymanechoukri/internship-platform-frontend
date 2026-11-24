import { useEffect, useState } from "react";
import { Avatar, Button, Card } from "../../components/ui/index.js";
import useAuth from "../../hooks/useAuth.js";
import { createStudentProfile, getStudentProfile, updateStudentProfile } from "../../services/studentService.js";

const EMPTY_PROFILE = { university: "", major: "", faculty: "", graduationYear: "", phone: "", bio: "" };

export function StudentProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    getStudentProfile()
      .then((data) => {
        if (!active) return;
        setProfile({
          university: data.university || "",
          major: data.major || "",
          faculty: data.faculty || "",
          graduationYear: data.graduationYear ? String(data.graduationYear) : "",
          phone: data.phone || "",
          bio: data.bio || "",
        });
        setExists(true);
      })
      .catch((err) => {
        if (!active) return;
        if (/not found/i.test(err.message)) setExists(false);
        else setError(err.message || "Unable to load your profile.");
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
    setSaving(true); setError(""); setNotice("");
    const payload = {
      university: profile.university.trim(),
      major: profile.major.trim(),
      faculty: profile.faculty.trim(),
      graduationYear: Number(profile.graduationYear),
      phone: profile.phone.trim(),
      bio: profile.bio.trim(),
    };
    try {
      if (exists) await updateStudentProfile(payload);
      else await createStudentProfile(payload);
      setExists(true);
      setNotice("Your profile has been saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save your profile.");
    } finally { setSaving(false); }
  };

  if (loading) return <p className="p-8 text-sm text-text-secondary">Loading your profile…</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">My profile</h1>
        <p className="mt-1 text-sm text-text-secondary">Your account and academic information used for internship applications.</p>
      </div>
      {error && <p role="alert" className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">{error}</p>}
      <Card padding="lg">
        <div className="mb-6 flex items-center gap-4">
          <Avatar name={user?.name || "Student"} size="xl" />
          <div className="min-w-0">
            <h2 className="font-semibold text-text-primary">{user?.name || "Student"}</h2>
            <p className="truncate text-xs text-text-secondary">{user?.email || ""}</p>
            <p className="mt-1 text-[11px] text-text-muted">Name and email are managed by your account settings.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-text-secondary">University / School
            <input name="university" required maxLength={160} value={profile.university} onChange={handleChange} className="mt-1.5 h-10 w-full rounded-lg border border-border px-3 text-sm font-normal text-text-primary" />
          </label>
          <label className="text-xs font-semibold text-text-secondary">Major / Specialization
            <input name="major" required maxLength={120} value={profile.major} onChange={handleChange} className="mt-1.5 h-10 w-full rounded-lg border border-border px-3 text-sm font-normal text-text-primary" />
          </label>
          <label className="text-xs font-semibold text-text-secondary">Faculty
            <input name="faculty" required maxLength={120} value={profile.faculty} onChange={handleChange} className="mt-1.5 h-10 w-full rounded-lg border border-border px-3 text-sm font-normal text-text-primary" />
          </label>
          <label className="text-xs font-semibold text-text-secondary">Graduation year
            <input name="graduationYear" type="number" min={new Date().getFullYear() - 20} max={new Date().getFullYear() + 10} required value={profile.graduationYear} onChange={handleChange} className="mt-1.5 h-10 w-full rounded-lg border border-border px-3 text-sm font-normal text-text-primary" />
          </label>
          <label className="text-xs font-semibold text-text-secondary sm:col-span-2">Phone number
            <input name="phone" type="tel" required maxLength={30} value={profile.phone} onChange={handleChange} className="mt-1.5 h-10 w-full rounded-lg border border-border px-3 text-sm font-normal text-text-primary" />
          </label>
          <label className="text-xs font-semibold text-text-secondary sm:col-span-2">Short bio
            <textarea name="bio" rows={4} maxLength={1000} value={profile.bio} onChange={handleChange} className="mt-1.5 w-full rounded-lg border border-border p-3 text-sm font-normal text-text-primary" placeholder="Introduce your academic interests and experience…" />
          </label>
          <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
            <p role="status" className="text-xs text-success-700">{notice}</p>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : exists ? "Save profile" : "Create profile"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default StudentProfilePage;
