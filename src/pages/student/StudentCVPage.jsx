import { useEffect, useState } from "react";
import { Button, Card } from "../../components/ui/index.js";
import { deleteMyCV, downloadMyCV, getMyCVs, uploadMyCV } from "../../services/cvService.js";

const formatSize = (bytes) => bytes ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : "Size unavailable";

export function StudentCVPage() {
  const [cvs, setCvs] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadCVs = async () => setCvs(await getMyCVs());

  useEffect(() => {
    let active = true;
    getMyCVs()
      .then((data) => { if (active) setCvs(data); })
      .catch((err) => { if (active) setError(err.message || "Unable to load your CVs."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) { setError("Choose a PDF file first."); return; }
    setUploading(true); setError(""); setNotice("");
    try {
      await uploadMyCV(file);
      await loadCVs();
      setFile(null);
      event.currentTarget.reset();
      setNotice("CV uploaded successfully.");
    } catch (err) { setError(err.message || "Unable to upload this CV."); }
    finally { setUploading(false); }
  };

  const handleDownload = async (cv) => {
    setBusyId(String(cv._id)); setError("");
    try {
      const blob = await downloadMyCV(cv._id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = cv.fileName || "my-cv.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) { setError(err.message || "Unable to download this CV."); }
    finally { setBusyId(""); }
  };

  const handleDelete = async (cv) => {
    if (!window.confirm(`Delete ${cv.fileName}?`)) return;
    setBusyId(String(cv._id)); setError(""); setNotice("");
    try {
      await deleteMyCV(cv._id);
      setCvs((current) => current.filter((item) => item._id !== cv._id));
      setNotice("CV deleted.");
    } catch (err) { setError(err.message || "Unable to delete this CV."); }
    finally { setBusyId(""); }
  };

  if (loading) return <p className="py-10 text-center text-sm text-text-secondary">Loading your CVs…</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div><h1 className="text-2xl font-bold text-text-primary sm:text-3xl">CV management</h1><p className="mt-1 text-sm text-text-secondary">Upload a PDF CV and manage the documents attached to your student profile.</p></div>
      {error && <p role="alert" className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">{error}</p>}
      {notice && <p role="status" className="rounded-lg bg-success-50 p-3 text-sm text-success-700">{notice}</p>}
      <Card padding="lg" className="space-y-4">
        <h2 className="font-semibold text-text-primary">Upload a new CV</h2>
        <p className="text-xs text-text-muted">PDF only · Maximum file size: 5 MB</p>
        <form onSubmit={handleUpload} className="space-y-4">
          <input type="file" accept="application/pdf,.pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} className="block w-full text-sm text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-700" />
          {file && <p className="text-xs text-text-muted">Selected: {file.name} · {formatSize(file.size)}</p>}
          <Button type="submit" disabled={uploading || !file}>{uploading ? "Uploading…" : "Upload CV"}</Button>
        </form>
      </Card>
      <Card padding="lg" className="space-y-4">
        <div className="flex items-center justify-between"><h2 className="font-semibold text-text-primary">Your CVs</h2><span className="text-xs text-text-muted">{cvs.length} file(s)</span></div>
        {cvs.map((cv) => <div key={cv._id} className="flex flex-col justify-between gap-3 border-t border-border pt-4 first:border-0 first:pt-0 sm:flex-row sm:items-center"><div className="min-w-0"><p className="break-all text-sm font-semibold text-text-primary">{cv.fileName}</p><p className="mt-1 text-xs text-text-muted">{formatSize(cv.fileSize)} · Uploaded {cv.createdAt ? new Date(cv.createdAt).toLocaleDateString() : "date unavailable"}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" disabled={busyId === String(cv._id)} onClick={() => handleDownload(cv)}>Download</Button><Button size="sm" variant="danger" disabled={busyId === String(cv._id)} onClick={() => handleDelete(cv)}>Delete</Button></div></div>)}
        {!cvs.length && <p className="py-6 text-center text-sm text-text-muted">No CV uploaded yet.</p>}
      </Card>
    </div>
  );
}

export default StudentCVPage;
